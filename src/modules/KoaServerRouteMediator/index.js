"use strict";

class KoaServerRouteMediator {
    /**
     * TODO: doc
     */
    constructor(server) {
        this._server = server;
    }

    /**
     * TODO: doc
     */
    assignRoute(httpVerb, routePath, routeConfig) {
        this._server.use(koaRoute[httpVerb](routePath, routes[httpVerb]));
    };
}

module.exports = KoaServerRouteMediator;
