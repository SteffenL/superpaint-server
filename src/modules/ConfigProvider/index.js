"use strict";

let utils = require("../utils");
let path = require("path");

class ConfigProvider {
    /**
     * TODO: doc
     */
    constructor(baseConfigDir, userConfigDir) {
        const defaultConfigName = "default";
        this._configFileExtension = ".json";

        this._config = null;
        this._baseConfigDir = baseConfigDir;
        this._userConfigDir = userConfigDir;
        // Load the default base config and the default user config
        this._defaultConfig = this._loadConfig(defaultConfigName);
    }

    /**
     * Get a named configuration, loading it if needed.
     * @param {String} name Name of the configuration.
     * @returns {Object} The configuration.
     */
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
            const fileName = name + this._configFileExtension;
            const baseConfigPath = path.join(this._baseConfigDir, fileName);
            const userConfigPath = path.join(this._userConfigDir, fileName);

            const baseConfig = require(lastConfigPath = baseConfigPath);
            const userConfig = require(lastConfigPath = userConfigPath);

            let mergedConfig = this._mergeConfig(baseConfig, userConfig);

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
        let baseCopy = utils.Object.copyProperties(base);
        return utils.Object.mergeProperties(baseCopy, source);
    }
}

module.exports = ConfigProvider;
