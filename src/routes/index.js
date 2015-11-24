"use strict";

let glob = require("glob");
let path = require("path");
let koaRoute = require("koa-route");

class Routes {
    constructor() {
        this._routeConfig = [];
        this._configure();
    }

    /**
    * Dynamically retrieves route information from files on the file system.
    * @param  server   Server instance returned by Koa.
    * @param  rootPath Path to the root directory containing route descriptor files.
    */
    setupRoutes(server) {
        for (let routesRoot of this._routeConfig) {
            for (let routePath in routesRoot) {
                let routes = routesRoot[routePath];
                for (let httpVerb in routes) {
                    server.use(koaRoute[httpVerb](routePath, routes[httpVerb]));
                }
            }
        }
    };

    /**
    * Validates the current route configuration.
    * @param  routeConfig The route configuration to validate.
    * @throws Will throw if an illegal HTTP verb is present in the route configuration.
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
        const routesDir = path.join(__dirname, "routes");
        this._routeConfig = [];

        // "./" will be removed if present, so let's make an absolute path
        let pattern = routesDir + "/**/*.js";
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

module.exports = new Routes();
