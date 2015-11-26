"use strict";

class KnexConfigAdapter {
    static toKnex(config) {
        if (!config) {
            return {};
        }

        return {
            client: config.type ? config.type : null,
            connection: {
                host: config.host ? config.host : null,
                user: config.username ? config.username : null,
                password: config.password ? config.password : null,
                database: config.database ? config.database : null,
                filename: config.filename ? config.filename : null,
                charset: config.charset ? config.charset : null
            }
        };
    }
}

module.exports = KnexConfigAdapter;
