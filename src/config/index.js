"use strict";

let Util = require("../util");
let path = require("path");

class ConfigProvider {
    constructor() {
        this._config = null;
        this._baseConfigDir = path.join(__dirname, "base");
        this._userConfigDir = path.join(__dirname, "../../config");
        // Load the default base config and the default user config
        this._defaultConfig = this._loadConfig("default");
    }

    get(name) {
        if (!this._config) {
            let environmentConfig = this._loadConfig(name);
            this._config = this._mergeConfig(this._defaultConfig, environmentConfig);
        }
        
        return this._config;
    }

    /**
     * Loads a configuration (base config merged with user config).
     * @param {String} name  The name of the configuration (without the file extension).
     * @returns {Object}
     */
    _loadConfig(name) {
        let lastConfigPath = null;
        try {
            const fileName = name + ".json";
            const baseConfigPath = path.join(this._baseConfigDir, fileName);
            const userConfigPath = path.join(this._userConfigDir, fileName);

            let mergedConfig = this._mergeConfig(
                require(lastConfigPath = baseConfigPath),
                require(lastConfigPath = userConfigPath)
            );
            return mergedConfig;
        }
        catch (ex) {
            console.error("Failed to load configuration file: " + lastConfigPath);
            throw ex;
        }
    }

    /**
     * Merges (already loaded) configurations recursively.
     * @param {Object} base The object (or rather a copy of it) that will be merged into.
     * @param {Object} source The object that will be merged.
     * @returns {Object}
     */
    _mergeConfig(base, source) {
        // A quick and dirty way to copy properties
        let baseCopy = JSON.parse(JSON.stringify(base));
        return Util.mergeObjectProperties(baseCopy, source);
    }
}

module.exports = new ConfigProvider();
