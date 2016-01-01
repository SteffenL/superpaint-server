"use strict";

const path = require("path"),
    AppContext = require("../AppContext"),
    KnexConfigAdapter = require("../modules/data/config_adapters/KnexConfigAdapter");

const appDir = path.join(__dirname, "..");

function loadKnexConfig(dataSource, environment) {
    let appContext = new AppContext({
        dataSource: dataSource,
        environment: environment
    });
    appContext.configure(appDir);
    return KnexConfigAdapter.toKnex(appContext.dataSource);
}

const dataSources = {
    development: loadKnexConfig("main", "development"),
    staging: loadKnexConfig("main", "staging"),
    production: loadKnexConfig("main", "production")
};

module.exports = {

    development: Object.assign(dataSources.development, {
    }),

    staging: Object.assign(dataSources.staging, {
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }),

    production: Object.assign(dataSources.production, {
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    })

};
