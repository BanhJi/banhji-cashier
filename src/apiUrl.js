'use strict'

const cookier = require("./cookier.js").cookie;
cookier.init();
const session            = require("./api/session")

module.exports = {
    session : session
}
