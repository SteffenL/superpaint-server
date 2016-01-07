"use strict";

const path = require("path"),
    appContext = require("../defaultAppContext"),
    bootConfig = require("../bootConfig"),
    KnexConfigAdapter = require("../modules/data/config_adapters/KnexConfigAdapter");

module.exports = {};
module.exports[bootConfig.environment] = KnexConfigAdapter.toKnex(appContext.config.dataSource);
