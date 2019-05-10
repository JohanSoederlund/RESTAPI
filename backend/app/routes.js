"use strict";

const Router = require("koa-router");
const ObjectID = require("mongodb").ObjectID;
const jwt = require('jsonwebtoken');
const decode = require('koa-jwt-decode');

const DatabaseManager = require("../database/databaseManager");
const LoginModel = require("../database/userModel");

const SECRET = process.env.SECRET;

const router = new Router();

/**
 * Every route below.
 */
router.get("/", async function (ctx) {
    ctx.response.status = 200;
    ctx.body = {
      links: {_self: "/", login: "/login", profile: "/profile", register: "/register"}
    };
});

router.post("/register", async function (ctx) {
    console.log("REGISTER");
    ctx.body = {};
    try {
        let user = {username: ctx.request.body.username, password: ctx.request.body.password, 
            token: jwt.sign({ username: ctx.request.body.username }, SECRET, {expiresIn: '1d'})};
        console.log(user);
        let result = await DatabaseManager.saveNewUser(user);
        console.log(result);
        ctx.body.links = {home: "/", login: "/login", profile: "/profile", _self: "/register"};
        ctx.response.status = 201;
        (result.success !== undefined ? (ctx.body = result, ctx.response.status = 400) : ctx.body = {username: result.username, token: result.token, success: true });
        
    } catch (error) {
        ctx.body = {value: "Internal server error", success: false};
        ctx.response.status = 500;
    }
});

router.post("/login", async function (ctx) {
    ctx.body = {};
    console.log("LOGIN");
    try {
        let user = {username: ctx.request.body.username, password: ctx.request.body.password, 
            token: jwt.sign({ username: ctx.request.body.username }, SECRET, {expiresIn: '1d'})};
        let result = await DatabaseManager.findAndUpdateUser(user);
        ctx.response.status = 200
        ctx.body.links = {home: "/", register: "/register", profile: "/profile", _self: "/login"};
        (result.success !== undefined ? (ctx.body = result, ctx.response.status = 400) : ctx.body = {username: result.username, token: result.token, success: true}); 
    } catch (error) {
        console.log(error);
        ctx.body = "Internal server error";
        ctx.response.status = 500;
    }
});

router.get("/profile", async function (ctx) {
    ctx.body = {};
    try {
        console.log("PROFILE");
        console.log(ctx.header.authorization);
        let decoded = await jwt.verify(ctx.header.authorization, SECRET);
        console.log(decoded);
        let journal;
        ctx.response.status = 401;
        if (decoded.exp < Math.floor((new Date).getTime()/1000)) ctx.body = {value: "Invalid session", success: false};
        else {
            journal = await DatabaseManager.findJournal({username: decoded.username});
            console.log(journal);
            ctx.response.status = 200;
            journal.success = true;
            ctx.body = journal;
        }
        
    } catch (error) {
        ctx.body = {value: "Internal server error", success: false};
        ctx.response.status = 500;
    }
});

router.post("/profile", async function (ctx) {
    ctx.body = {};
    try {
        console.log("PROFILE");
        let user = {username: ctx.request.body.username, article: ctx.request.body.journal}
        console.log("PROFILE");
        console.log(ctx.header.authorization);
        let decoded = await jwt.verify(ctx.header.authorization, SECRET);
        console.log(decoded);
        console.log(decoded.exp > (new Date).getTime());
        console.log(decoded.exp);
        console.log((new Date).getTime());
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

    await DatabaseManager.dropCollection(users).then( (result) => {
        console.log(result);
        ctx.redirect('/');
    })
    
});

module.exports = {
    router
}