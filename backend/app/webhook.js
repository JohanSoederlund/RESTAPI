"use strict";

const axios = require('axios');

function postToCallback(user, data) {
    axios.post(user.webhookCallback, data)
    .then((res) => {
        console.log(`statusCode: ${res.statusCode}`)
    })
    .catch((error) => {
        console.error(error)
    })
}

module.exports = {
    postToCallback
}