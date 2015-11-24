"use strict";

class KoaServerRouteMediator {
    constructor(server) {
        this._server = server;
    }

    /**
     */
    assignRoute(httpVerb, routePath, routeConfig) {
        this._server.use(koaRoute[httpVerb](routePath, routes[httpVerb]));
    };
}

module.exports = KoaServerRouteMediator;
