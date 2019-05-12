"use strict";

const axios = require('axios');

/**
 * Publish/subsribe functionality for future use
 */
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