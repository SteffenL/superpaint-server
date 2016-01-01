"use strict";

const knexFactory = require("knex"),
    KnexConfigAdapter = require("./config_adapters/KnexConfigAdapter");

class KnexFactory {
    static create(config) {
        return knexFactory(KnexConfigAdapter.toKnex(config));
    }
}

module.exports = KnexFactory;
