"use strict";

// Imports
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserModel = require('./userModel');

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


function dropCollection(collection1, collection2) {
    return new Promise((resolve, reject) => {
        mongoose.connection.db.dropCollection( collection1 )
        .then( (response) => {
        })
        .catch((error) => {
            //reject("Could not drop collection: \n" + error, false);
        });
        mongoose.connection.db.dropCollection( collection2 )
        .then( (response) => {
            resolve(response);
        })
        .catch((error) => {
            reject("Could not drop collection: \n" + error, false);
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
        return await user.save();
        
    } catch (error) {
        console.log(error);
    }
}

async function findUser(user) {

    let databaseUser = await UserModel.findOne({username: user.username});
    let same = await bcrypt.compare(user.password, databaseUser.password);
    console.log(same);
    if (same) return databaseUser;
    else return {value: "wrong username or password", success: false};
    
}


module.exports = {
    connectDatabase,
    disconnectDatabase,
    dropCollection,
    saveNewUser,
    findUser
}
