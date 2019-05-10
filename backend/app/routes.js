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
            token: jwt.sign({ username: ctx.request.body.user }, SECRET, {expiresIn: '1d'})};
        console.log(user);
        let result = await DatabaseManager.saveNewUser(user);
        console.log(result);
        ctx.body.links = {home: "/", login: "/login", profile: "/profile", _self: "/register"};
        ctx.response.status = 201;
        (result.success !== undefined ? (ctx.body = result, ctx.response.status = 400) : ctx.body = {username: result.username, token: result.token });
        
    } catch (error) {
        ctx.body = "Internal server error";
        ctx.response.status = 500;
    }
});

router.post("/login", async function (ctx) {
    ctx.body = {};
    console.log("LOGIN");
    try {
        //token: jwt.sign({ username: ctx.request.body.user }, SECRET, {expiresIn: '1d'})};
        let result = await DatabaseManager.findUser({username: ctx.request.body.username, password: ctx.request.body.password});
        ctx.response.status = 200
        ctx.body.links = {home: "/", register: "/register", profile: "/profile", _self: "/login"};
        (result.success !== undefined ? (ctx.body = result, ctx.response.status = 400) : ctx.body = {username: result.username, token: result.token }); 
    } catch (error) {
        ctx.body = "Internal server error";
        ctx.response.status = 500;
    }
});

router.get("/profile", async function (ctx) {
    ctx.body = {};
    try {
        
    } catch (error) {
        ctx.body = "Internal server error";
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