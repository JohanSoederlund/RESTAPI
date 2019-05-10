"use strict";

const mongoose = require('mongoose');

let journalSchema = new mongoose.Schema({
    username: { type: String, required: true },
    articles: { type: Array, required: true}
  });

let Journal = mongoose.model('journal', journalSchema);

module.exports = Journal;