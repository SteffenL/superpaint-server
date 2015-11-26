"use strict";

let path = require("path");

let ConfigProvider = require("./modules/ConfigProvider");
var currentBootConfig = require("../bootConfig.json");
let BookshelfFactory = require("./modules/data/BookshelfFactory");

/**
 * A class encapsulating data that is shared across the application.
 */
class AppContext {
    constructor(bootConfig) {
        this._bootConfig = bootConfig;
    }

    /**
     * @param {String} appDir
     */
    configure(appDir) {
        this._appDir = appDir;

        this._dataStoreDir = path.join(this._appDir, "../data_store");
        this._logsDir = path.join(this._appDir, "../logs");
        this._routesDir = path.join(this._appDir, "routes");

        this._config = this._loadConfig(this._bootConfig.environment);
        this._dataSource = this._normalizeDataSource(this._config.dataSources[this._bootConfig.dataSource]);
        this._bookshelf = BookshelfFactory.create(this._dataSource);
    }

    get appDir() {
        return this._appDir;
    }

    get dataStoreDir() {
        return this._dataStoreDir;
    }

    get logsDr() {
        return this._logsDir;
    }

    get routesDir() {
        return this._routesDir;
    }

    get config() {
        return this._config;
    }

    get dataSource() {
        return this._dataSource;
    }

    get bookshelf() {
        return this._bookshelf;
    }

    _loadConfig(name) {
        let configProvider = new ConfigProvider(
            path.join(this._appDir, "base_config"),
            path.join(this._appDir, "../config"));

        return configProvider.get(name);
    }

    _normalizeDataSource(ds) {
        if (!ds) {
            return {};
        }

        if (ds.filename) {
            ds.filename = path.join(this._dataStoreDir, ds.filename);
        }

        return ds;
    }
}

AppContext.instance = new AppContext(currentBootConfig);

module.exports = AppContext;
