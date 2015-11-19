var path = require("path");

function ConfigProvider() {
    this._config = null;
}

ConfigProvider.prototype.configure = function(environment) {
    console.log("Loading configuration...");

    var userConfigDir = "../../config";

    var defaultConfig = this._mergeConfig(
        require("./base/default.json"),
        // User's default config
        require(path.join(userConfigDir, "default.json"))
    );

    var environmentConfig = this._mergeConfig(
        require("./base/" + environment + ".json"),
        // User's environment-specific config
        require(path.join(userConfigDir, environment + ".json"))
    );

    this._config = this._mergeConfig(defaultConfig, environmentConfig);
    return this;
}

ConfigProvider.prototype.get = function() {
    return this._config;
}

ConfigProvider.prototype._mergeConfig = function(base, source) {
    var result = base;
    for (var k in source) {
        if (source.hasOwnProperty(k)) {
            result[k] = result.hasOwnProperty(k) && source[k].constructor === Object
                ? this._mergeConfig(result[k], source[k])
                : source[k];
        }
    }
    
    return result;
}

module.exports = new ConfigProvider();
