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
    try {
        if (typeof ctx.request.body.username !== "string" || typeof ctx.request.body.password !== "string") {
            ctx.response.status = 400;
            ctx.body = {value: "Incorrect username or password", success: false};
        } else {
            //using jwt token for sessions and authorization
            let user = {username: ctx.request.body.username, password: ctx.request.body.password, 
                token: jwt.sign({ username: ctx.request.body.username }, SECRET, {expiresIn: '1d'})};

            let result = await DatabaseManager.saveNewUser(user);
            ctx.response.status = 201;

            (result.success !== undefined 
                ? (ctx.body = result, ctx.response.status = 400) 
                : ctx.body = {
                    links: {home: "/", login: "/login", journal: "/journal", _self: "/register"},
                    username: result.username, 
                    token: result.token, 
                    success: true
                });
        }
    } catch (error) {
        ctx.body = {value: "Internal server error", success: false};
        ctx.response.status = 500;
    }
});

/**
 * Todo implement delete user
 */
router.delete("/register", async function (ctx) {
    
});

router.post("/login", async function (ctx) {
    ctx.body = {};
    try {
        let username = ctx.request.body.username, password = ctx.request.body.password;
        if (typeof username !== "string" || typeof password !== "string") {
            ctx.response.status = 400;
            ctx.body = {value: "Incorrect username or password", success: false};
        } else {
            //using jwt token for sessions and authorization
            let user = {username: username, password: password, 
                token: jwt.sign({ username: username }, SECRET, {expiresIn: '1d'})};

            let result = await DatabaseManager.findAndUpdateUser(user);
            ctx.response.status = 200;

            (result.success !== undefined 
                ? (ctx.body = result, ctx.response.status = 400) 
                : ctx.body = {
                    links: {home: "/", register: "/register", journal: "/journal", _self: "/login"},
                    username: result.username, 
                    token: result.token, 
                    success: true
                }); 
            }
    } catch (error) {
        ctx.body = "Internal server error";
        ctx.response.status = 500;
    }
});

router.get("/journal", async function (ctx) {
    ctx.body = {};
    try {
        ctx.response.status = 401;
        if (ctx.header.authorization === undefined) {
            ctx.body = {value: "Invalid session", success: false};
        } else {
            let decoded = await jwt.verify(ctx.header.authorization, SECRET);

            //check that jwt is still valid
            if (decoded.exp < Math.floor((new Date).getTime()/1000)) {
                ctx.body = {value: "Invalid session", success: false};
            } else {
                let journal = await DatabaseManager.findJournal({username: decoded.username});
                ctx.response.status = 200;

                ctx.body = {
                    links: {home: "/", register: "/register", login: "/login", _self: "/journal"},
                    username: journal.username, 
                    articles: journal.articles,
                    success: true
                }
            }
        }
    } catch (error) {
        ctx.body = {value: "Internal server error", success: false};
        ctx.response.status = 500;
    }
});

router.post("/journal", async function (ctx) {
    ctx.body = {};
    try {
        ctx.response.status = 401;
        if (ctx.header.authorization === undefined) {
            ctx.body = {value: "Invalid session", success: false};
        } else {
            //verifying jwt
            let decoded = await jwt.verify(ctx.header.authorization, SECRET);
            let user = {username: decoded.username, article: ctx.request.body.article}

            //check that jwt is still valid
            if (decoded.exp < Math.floor((new Date).getTime()/1000)) {
                ctx.body = {value: "Invalid session", success: false};
            } else {

                //Add article to journal
                let journal = await DatabaseManager.insertToJournal(user);
                ctx.response.status = 201;

                ctx.body = {
                    links: {home: "/", register: "/register", login: "/login", _self: "/journal"},
                    username: journal.username, 
                    articles: journal.articles,
                    success: true
                }
            }
        }
    } catch (error) {
        ctx.body = {value: "Internal server error", success: false};    
        ctx.response.status = 500;
    }
});

/**
 * Todo implement delete journal
 */
router.delete("/journal", async function (ctx) {
    
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