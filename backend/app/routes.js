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
      links: {_self: "/", login: "/login", register: "/register"}
    };
});

router.post("/register", async function (ctx) {
    ctx.body = {};
    try {
        let user = {user: ctx.request.body.user, password: ctx.request.body.password, 
            token: jwt.sign({ user: ctx.request.body.user }, SECRET, {expiresIn: '1d'}), webhookCallback: ctx.request.body.webhookCallback};
        user = new LoginModel(user);
        await DatabaseManager.saveNewUser(user)
        .then( (result) => {
            ctx.body.links = {home: "/", login: "/login", _self: "/register"};
            ctx.body = result.value;
            if (result.success) {
                ctx.response.status = 201;
            } else {
                ctx.response.status = 400;
            }
        });
    } catch (error) {
        if (error.value === "Internal server error") ctx.response.status = 500;
        else ctx.response.status = 400;
        ctx.body = error;
    }
});

router.post("/login", async function (ctx) {
    ctx.body = {};
    try {
        await DatabaseManager.findUser({user: ctx.request.body.user, password: ctx.request.body.password }, true)
        .then( (result) => {
            ctx.body.links = {home: "/", _self: "/login", register: "/register"};
            if (result.success) {
                ctx.response.status = 200;
                ctx.body.token = result.value.token;
            } else {
                ctx.response.status = 401;
            }
        })
    } catch (error) {
        ctx.response.status = 401;
        ctx.body = error;
    }
});

/**
 * For development reasons, remove in production
 */
router.get("/drop", async function (ctx) {
    ctx.response.status = 307;
    const users = "apiusers";

    await DatabaseManager.dropCollection(users).then( (result) => {
        ctx.redirect('/');
    })
    
});

//export default router;
module.exports = {
    router
}