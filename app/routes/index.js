function Routes() {
    this._routeConfig = [];
    this._configure();
}

/**
 * Dynamically retrieves route information from files on the file system.
 * @param  server   Server instance returned by restify.
 * @param  rootPath Path to the root directory containing route descriptor files.
 */
Routes.prototype.setupRoutes = function(server) {
    this._routeConfig.forEach(function(routesRoot) {
        for (var routePath in routesRoot) {
            var routes = routesRoot[routePath];
            for (var httpVerb in routes) {
                server[httpVerb](routePath, routes[httpVerb]);
            }
        }
    });
};

/**
 * Validates the current route configuration.
 * @param  routeConfig The route configuration to validate.
 * @throws Will throw if an illegal HTTP verb is present in the route configuration.
 */
Routes.prototype._validate = function(routeConfig) {
    var legalHttpVerbs = ["get", "post", "put", "head", "delete"];

    this._routeConfig.forEach(function(routesRoot) {
        for (var routePath in routesRoot) {
            var routes = routesRoot[routePath];
            for (var httpVerb in routes) {
                if (!legalHttpVerbs.indexOf(httpVerb) != -1) {
                    throw "Illegal HTTP verb: " + httpVerb;
                }
            }
        }
    });
};

/**
 * Dynamically retrieves route information from files on the file system.
 */
Routes.prototype._configure = function() {
    console.log("Loading URL routes...");

    var glob = require("glob");
    var path = require("path");

    this._routeConfig = [];
    var routesDir = path.join(__dirname, "routes");

    // "./" will be removed if present, so let's make an absolute path
    var pattern = routesDir + "/**/*.js";
    // glob needs forward-slashes
    pattern = pattern.replace(/\\/g, "/");
    var matches = glob.sync(pattern);

    matches.forEach(function(match) {
        var routeConfig = require(match);
        this._validate(routeConfig);
        this._routeConfig.push(routeConfig);
    }.bind(this));
};

module.exports = new Routes();
