"use strict";

const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    user: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: true },
    webhookCallback: { type: String, required: false }
  });

let Apiuser = mongoose.model('apiuser', userSchema);

module.exports = Apiuser;