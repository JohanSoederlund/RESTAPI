"use strict";

// Imports
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserModel = require('./userModel');
const JournalModel = require('./journalModel');

const connectionString = 'mongodb://localhost:27017';
   
function connectDatabase() {
    //mongoose.connect(connectionString, { useNewUrlParser: true })
    mongoose.connect(connectionString)
    .then( ()=> {
        console.log("CONNECTED to " + connectionString);
    })
    .catch((err) => {
        console.log('connection-error', err);
    });
}
    
/**
 * Disconnects from the database if there is an active connection.
 */
function disconnectDatabase() {
    mongoose.connection.close( (err)=> {
        if (err) console.error(err);
        else console.log("DISCONNECTED from " + connectionString);
    })
}


function dropCollection(collection1) {
    return new Promise((resolve, reject) => {
        mongoose.connection.db.dropCollection( collection1 )
        .then( (response) => {
        })
        .catch((error) => {
            //reject("Could not drop collection: \n" + error, false);
        });
        
    });
}

async function saveNewUser(user) {
    try {
        user = new UserModel(user);
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        if (await UserModel.findOne({username: user.username})) {
            console.log("username taken");
            return {value: "username taken", success: false};
        }
        let journal = new JournalModel({username: user.username, articles: ["Hello world!"]});
        let jour = await journal.save();
        console.log(jour);
        return await user.save();
        
    } catch (error) {
        console.log(error);
    }
}

async function findAndUpdateUser(user) {
    let conditions = {username: user.username}
    let databaseUser = await UserModel.findOne(conditions);
    if(databaseUser === null || databaseUser === undefined) return {value: "user doesn't exist", success: false};
    if (await bcrypt.compare(user.password, databaseUser.password)) {
        let update = {$set:{token: user.token}};
        let options = {new: true};
        
        let updatedUser = await UserModel.findOneAndUpdate(conditions, update, options)
        return updatedUser;
    }
    return {value: "wrong username or password", success: false};
}

async function findJournal(user) {
    let conditions = {username: user.username};
    let journal = await JournalModel.findOne(conditions);
    return journal;
}

async function insertToJournal(user) {
    let conditions = {username: user.username};
    let journal = await JournalModel.findOne(conditions);
    let articles = journal.articles.push(user.article);
    let update = {$set:{articles: articles}};
    let options = {new: true};
    let updatedJournal = await JournalModel.findOneAndUpdate(conditions, update, options)
    return updatedJournal;
}

module.exports = {
    connectDatabase,
    disconnectDatabase,
    dropCollection,
    saveNewUser,
    findAndUpdateUser,
    findJournal,
    insertToJournal
}
