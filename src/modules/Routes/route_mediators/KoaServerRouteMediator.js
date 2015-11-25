"use strict";

let koaRoute = require("koa-route");

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
    assignRoute(httpVerb, routePath, handler) {
        let method = koaRoute[httpVerb];
        this._server.use(method(routePath, handler));
    };
}

module.exports = KoaServerRouteMediator;
