"use strict";

// Imports
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userModel = require('./userModel');
const Webhook = require('../app/webhook');

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

function saveNewUser(user) {
    return new Promise((resolve, reject) => {
        if(JSON.stringify(user.schema) !== JSON.stringify(userModel.schema)) {
            reject({value: "Wrong schema error", success: false});
        } 

        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                reject({value: "Internal server error", success: false});
            };

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    reject({value: "Internal server error", success: false});
                };
                user.password = hash;

                findUser({user: user.user}, false).then( (existingUser) => {
                    if (existingUser.value === null) {
                        user.save( (err, saved)=> {
                            if(err) reject({value: err, success: false});
                            resolve({value: saved, success: true});
                        })
                    } else {
                        reject({value: "User allready exist", success: false});
                    }
                })
                .catch((error) => {
                    reject({value: error, success: false});
                });

            });
          });
        
    });
}

function findUser(usr, login) {
    return new Promise((resolve, reject) => {
        userModel.findOne({user: usr.user})
        .then((user) => {
            if (login) {
                bcrypt.compare(usr.password, user.password, function(err, res) {
                    if (err) reject({value: "Wrong username or password", success: false});
                    if (res === false) reject({value: "Wrong username or password", success: false});
                    else resolve({value: user, success: true});
                  });
            } else {
                resolve({value: user, success: true});
            }
        })
        .catch((error) => {
            reject({value: "Invalid user credentials", success: false});
        });
    });
}


module.exports = {
    connectDatabase,
    disconnectDatabase,
    dropCollection,
    saveNewUser,
    findUser
}
