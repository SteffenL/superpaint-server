"use strict";

class KnexConfigAdapter {
    static toKnex(config) {
        if (!config) {
            return {};
        }

        return {
            client: config.client,
            connection: config.connection
        };
    }
}

module.exports = KnexConfigAdapter;
