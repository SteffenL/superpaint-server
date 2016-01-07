"use strict";

const path = require("path"),
    ConfigProvider = require("./modules/ConfigProvider"),
    BookshelfFactory = require("./modules/data/BookshelfFactory"),
    bootConfig = require("./bootConfig");

/**
 * A class encapsulating data that is shared across the application.
 */
class AppContext {
    constructor() {
        this._routesDir = path.join(bootConfig.appDir, "routes");
        this._config = this._loadConfig(bootConfig.environment);
        this._bookshelf = BookshelfFactory.create(this._config.dataSource);
    }

    get routesDir() {
        return this._routesDir;
    }

    get config() {
        return this._config;
    }

    get bookshelf() {
        return this._bookshelf;
    }

    _loadConfig(name) {
        const configProvider = new ConfigProvider(
            path.join(bootConfig.appDir, "base_config"),
            path.join(bootConfig.appDir, "../config"));

        return configProvider.get(name);
    }
}

module.exports = AppContext;
