"use strict";

const util = require("util");

// Maps environment variable names to names we use internally
const varNameMappings = {
    // This variable is provided by Heroku.
    PORT: {
        name: "portOverride",
        defaultValue: null
    },
    SUPERPAINT_DATASOURCE: {
        name: "dataSource",
        defaultValue: "main"
    },
    SUPERPAINT_ENVIRONMENT: {
        name: "environment",
        defaultValue: "development"
    }
};

const config = {};

for (const varName in varNameMappings) {
    const target = varNameMappings[varName];
    const value = process.env.hasOwnProperty(varName) ? process.env[varName] : target.defaultValue;
    config[target.name] = value;
}

module.exports = config;
