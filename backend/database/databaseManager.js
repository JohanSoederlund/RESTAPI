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

async function dropCollection(collection1, collection2) {
    let result1 = await mongoose.connection.db.dropCollection( collection1 );
    let result2 = await mongoose.connection.db.dropCollection( collection2 );
    return [result1, result2];
}

async function saveNewUser(user) {
    try {
        user = new UserModel(user);

        //salt to strengthen hash
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        if (await UserModel.findOne({username: user.username})) {
            return {value: "username taken", success: false};
        }

        //Saving new user with hashed pw and new journal with same username
        let journal = new JournalModel({username: user.username, articles: [{article: "Hello world!", date: formatedDate()}]});
        await journal.save();
        return await user.save();
        
    } catch (error) {
        console.log(error);
        return {value: "Internal server error", success: false};
    }
}

async function findAndUpdateUser(user) {
    let conditions = {username: user.username}
    let databaseUser = await UserModel.findOne(conditions);
    if(databaseUser === null || databaseUser === undefined) return {value: "user doesn't exist", success: false};

    //Compares hashed password in database with client sent password 
    if (await bcrypt.compare(user.password, databaseUser.password)) {
        let update = {$set:{token: user.token}};
        let options = {new: true};
        
        return await UserModel.findOneAndUpdate(conditions, update, options)
    }
    return {value: "wrong username or password", success: false};
}

async function findJournal(user) {
    let conditions = {username: user.username};
    let journal = await JournalModel.findOne(conditions);
    return journal;
}

async function insertToJournal(user) {
    let serchcontions = {username: user.username};
    let journal = await JournalModel.findOne(serchcontions);
    let articles = journal.articles;
    articles.push(user.article);
    let update = {$set:{articles: articles}};
    let options = {new: true};
    //return updated journal
    return await JournalModel.findOneAndUpdate(serchcontions, update, options)
}

function formatedDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    } 
    if (mm < 10) {
      mm = '0' + mm;
    } 
    return dd + '/' + mm + '/' + yyyy;
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
