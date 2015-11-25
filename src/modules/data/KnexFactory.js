"use strict";

let knexFactory = require("knex");
let KnexConfigAdapter = require("./config_adapters/KnexConfigAdapter");

class KnexFactory {
    static create(config) {
        return knexFactory(KnexConfigAdapter.toKnex(config));
    }
}

module.exports = KnexFactory;
