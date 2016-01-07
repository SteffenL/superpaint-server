"use strict";

const path = require("path"),
    util = require("util"),
    bootConfig = require("../bootConfig");

function getEnvironmentVariableOrThrow(varName) {
    if (!process.env.hasOwnProperty(varName)) {
        throw new Error("Environment variable is not set: " + varName);
    }

    const value = process.env[varName];
    return value;
}

function getEnvironmentVariableOrDefault(varName, defaultValue) {
    let value = null;
    if (!process.env.hasOwnProperty(varName)) {
        value = defaultValue;
    }
    else {
        value = process.env[varName];
    }

    return value;
}


const rootDir = path.join(bootConfig.appDir, "..");
const dataStoreDir = path.join(rootDir, "data_store");

module.exports = {
    server: {
        // PORT is provided by Heroku
        httpPort: getEnvironmentVariableOrDefault("PORT", 80),
        // PORT is provided by Heroku
        httpsPort: getEnvironmentVariableOrDefault("PORT", 443),
        useHttps: false,
        // SSL settings for HTTPS
        ssl: {
            // Path to a file containing the private key.
            keyPath: null,
            // Path to a file containing the certificate.
            certificatePath: null
        }
    },
    dataSource: {
        // Make sure to set this to whichever database client you use (see Knex.js documentation).
        // Examples: sqlite3, pg, mysql
        client: getEnvironmentVariableOrDefault("SUPERPAINT_DB_CLIENT", "sqlite3"),
        // Connection string for the database (see Knex.js documentation).
        // Knex.js supports JSON-encoded configuration.
        connection: getEnvironmentVariableOrDefault(
            // DATABASE_URL is provided by Heroku as a connection string.
            "DATABASE_URL",
            JSON.parse(getEnvironmentVariableOrDefault(
                // If DATABASE_URL was not set, check for our own JSON-encoded variable.
                "SUPERPAINT_DB_CONNECTION", JSON.stringify(
                    {
                        // JSON-encoded defaults
                        filename: path.join(dataStoreDir, "superpaint.db")
                    })))
    },
    logsDir: path.join(rootDir, "logs"),
    uploadsDir: path.join(rootDir, "uploads"),
    policies: {
        document: {
            uploadLimits: {
                imageSize: {
                    width: { min: 256, max: 1920 },
                    height: { min: 256, max: 1080 },
                },
                fileSize: { min: 128, max: 1048576 },
                countLimit: 100000
            }
        }
    }
};
