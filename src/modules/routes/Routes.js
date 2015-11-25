"use strict";

let glob = require("glob");
let path = require("path");

class Routes {
    /**
     * @param {String} routesDir Path to the root directory containing route descriptor files.
     */
    constructor(routesDir) {
        // Get the aboslute routes dir to please glob later
        this._routesDir = path.normalize(routesDir);

        this._routeConfig = [];
        this._configure();
    }

    /**
     * Dynamically retrieves route information from files on the file system.
     * @param mediator Server/Route mediator.
     */
    assignToServer(mediator) {
        for (let routesRoot of this._routeConfig) {
            for (let routePath in routesRoot) {
                let routes = routesRoot[routePath];
                for (let httpVerb in routes) {
                    let handler = routes[httpVerb];
                    mediator.assignRoute(httpVerb, routePath, handler);
                }
            }
        }
    };

    /**
     * Validates the current route configuration.
     * @param  routeConfig The route configuration to validate.
     * @throws When an illegal HTTP verb is present in the route configuration.
     */
    _validate(routeConfig) {
        let legalHttpVerbs = ["get", "post", "put", "head", "delete"];

        for (let routesRoot of this._routeConfig) {
            for (let routePath in routesRoot) {
                let routes = routesRoot[routePath];
                for (let httpVerb in routes) {
                    if (legalHttpVerbs.indexOf(httpVerb) == -1) {
                        throw new Error("Illegal HTTP verb: " + httpVerb);
                    }
                }
            }
        }
    };

    /**
     * Dynamically retrieves route information from files on the file system.
     */
    _configure() {
        this._routeConfig = [];

        // "./" will be removed if present, so let's make an absolute path
        // Note: To make glob happy, make sure the path is absolute or that it's a relative path starting with dot-slash (./).
        let pattern = this._routesDir + "/**/*.js";
        // glob needs forward-slashes
        pattern = pattern.replace(/\\/g, "/");
        const matches = glob.sync(pattern);

        for (let match of matches) {
            let routeConfig = require(match);
            this._validate(routeConfig);
            this._routeConfig.push(routeConfig);
        }
    };
}

module.exports = Routes;
