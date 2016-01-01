"use strict";

const koaRoute = require("koa-route");

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
    assignRoute(httpVerb, routePath, obj) {
        const method = koaRoute[httpVerb];

        // This can be used to pass data from validators to handlers
        this._server.use(function*(next) {
            this.params = {};
            yield next;
        });

        if (obj.validate) {
            this._server.use(method(routePath, obj.validate));
        }

        if (obj.handle) {
            this._server.use(method(routePath, obj.handle));
        }
    };
}

module.exports = KoaServerRouteMediator;
