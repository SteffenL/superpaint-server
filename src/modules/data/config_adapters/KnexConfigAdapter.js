"use strict";

class KnexConfigAdapter {
    static toKnex(config) {
        return {
            client: config.type,
            connection: {
                host: config.host,
                user: config.username,
                password: config.password,
                database: config.database,
                filename: config.filename,
                charset: config.charset
            }
        };
    }
}

module.exports = KnexConfigAdapter;
