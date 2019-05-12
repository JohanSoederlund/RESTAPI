"use strict";

const Router = require("koa-router");
const jwt = require('jsonwebtoken');
const decode = require('koa-jwt-decode');

const DatabaseManager = require("../database/databaseManager");

const SECRET = process.env.SECRET;

const router = new Router();


/**
 * Every route below.
 */
router.get("/", async function (ctx) {
    ctx.response.status = 200;
    ctx.body = {
      links: {_self: "/", login: "/login", journal: "/journal", register: "/register"}
    };
});

router.post("/register", async function (ctx) {
    ctx.body = {};
    try {
        let user = {username: ctx.request.body.username, password: ctx.request.body.password, 
            token: jwt.sign({ username: ctx.request.body.username }, SECRET, {expiresIn: '1d'})};
        let result = await DatabaseManager.saveNewUser(user);
        ctx.body.links = {home: "/", login: "/login", journal: "/journal", _self: "/register"};
        ctx.response.status = 201;
        (result.success !== undefined ? (ctx.body = result, ctx.response.status = 400) : ctx.body = {username: result.username, token: result.token, success: true });
        
    } catch (error) {
        ctx.body = {value: "Internal server error", success: false};
        ctx.response.status = 500;
    }
});

/**
 * Todo
 */
router.delete("/register", async function (ctx) {
    
});

router.post("/login", async function (ctx) {
    ctx.body = {};
    try {
        let user = {username: ctx.request.body.username, password: ctx.request.body.password, 
            token: jwt.sign({ username: ctx.request.body.username }, SECRET, {expiresIn: '1d'})};
        let result = await DatabaseManager.findAndUpdateUser(user);
        ctx.response.status = 200;
        ctx.body.links = {home: "/", register: "/register", _self: "/login", journal: "/journal"};
        (result.success !== undefined ? (ctx.body = result, ctx.response.status = 400) : ctx.body = {username: result.username, token: result.token, success: true}); 
    } catch (error) {
        ctx.body = "Internal server error";
        ctx.response.status = 500;
    }
});

router.get("/journal", async function (ctx) {
    ctx.body = {};
    try {
        let decoded = await jwt.verify(ctx.header.authorization, SECRET);
        let journal;
        ctx.response.status = 401;
        if (decoded.exp < Math.floor((new Date).getTime()/1000)) ctx.body = {value: "Invalid session", success: false};
        else {
            journal = await DatabaseManager.findJournal({username: decoded.username});
            ctx.response.status = 200;
            journal.success = true;
            ctx.body = journal;
        }
        
    } catch (error) {
        ctx.body = {value: "Internal server error", success: false};
        ctx.response.status = 500;
    }
});

router.post("/journal", async function (ctx) {
    ctx.body = {};
    try {
        let decoded = await jwt.verify(ctx.header.authorization, SECRET);
        let user = {username: decoded.username, article: ctx.request.body.article}
        ctx.response.status = 401;
        if (decoded.exp < Math.floor((new Date).getTime()/1000)) ctx.body = {value: "Invalid session", success: false};
        else {
            let journal = await DatabaseManager.insertToJournal(user);
            ctx.response.status = 201;
            journal.success = true;
            ctx.body = journal;
        }
    } catch (error) {
        ctx.body = {value: "Internal server error", success: false};    
        ctx.response.status = 500;
    }
});

/**
 * For development reasons, remove in production
 */
router.get("/drop", async function (ctx) {
    ctx.response.status = 307;
    const users = "apiusers";
    const journals = "journals";

    await DatabaseManager.dropCollection(users, journals).then( (result) => {
        ctx.redirect('/');
    })
});

module.exports = {
    router
}