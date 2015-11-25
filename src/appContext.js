"use strict";

let path = require("path");

let ConfigProvider = require("./modules/ConfigProvider");
var bootConfig = require("../bootConfig.json");

/**
 * A class encapsulating data that is shared across the application.
 */
class AppContext {
    /**
     * @param {String} appDir
     */
    configure(appDir) {
        this._appDir = appDir;

        this._dataStoreDir = path.join(this._appDir, "../data_store");
        this._logsDir = path.join(this._appDir, "../logs");
        this._routesDir = path.join(this._appDir, "routes");

        this._config = this._loadConfig(bootConfig.environment);
        this._dataSource = this._normalizeDataSource(this._config.dataSources[bootConfig.dataSource]);
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

    _loadConfig(name) {
        let configProvider = new ConfigProvider(
            path.join(this._appDir, "base_config"),
            path.join(this._appDir, "../config"));

        return configProvider.get(name);
    }

    _normalizeDataSource(ds) {
        ds.filename = path.join(this._dataStoreDir, ds.filename);
        return ds;
    }
}

module.exports = new AppContext();
