"use strict";

const path = require("path"),
    ConfigProvider = require("./modules/ConfigProvider"),
    BookshelfFactory = require("./modules/data/BookshelfFactory");

const currentBootConfig = require("./bootConfig");

/**
 * A class encapsulating data that is shared across the application.
 */
class AppContext {
    constructor(bootConfig) {
        this._bootConfig = bootConfig;
        this._routesDir = path.join(this._bootConfig.appDir, "routes");
        this._config = this._loadConfig(this._bootConfig.environment, this._bootConfig);
        this._bookshelf = BookshelfFactory.create(this._config.dataSource);
        console.log(this._config.dataSource)
    }

    get appDir() {
        return this._bootConfig.appDir;
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

    _loadConfig(name, bootConfig) {
        const configProvider = new ConfigProvider(
            path.join(this._bootConfig.appDir, "base_config"),
            path.join(this._bootConfig.appDir, "../config"),
            bootConfig);

        return configProvider.get(name);
    }
}

module.exports = new AppContext(currentBootConfig);
