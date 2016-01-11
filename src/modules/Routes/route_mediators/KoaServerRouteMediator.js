"use strict";

const koaRoute = require("koa-route");

/**
 * A mediator class for assigning our route configuration to Koa servers and Koa routes.
 */
class KoaServerRouteMediator {
    /**
     * @param server An instance of a Koa server.
     */
    constructor(server) {
        this._server = server;
    }

    /**
     * Takes the specified route configuration, translates it into Koa routes and assigns them to a Koa server instance.
     * @param {String} httpVerb HTTP verb, e.g. get, post, etc.
     * @param {String} routePath Relative resource path for the route.
     * @param {Object} handler A user-defined object that contains the route handler and validator.
     */
    assignRoute(httpVerb, routePath, handler) {
        const method = koaRoute[httpVerb];

        // This can be used to pass data from validators to handlers
        this._server.use(function*(next) {
            this.params = {};
            yield next;
        });

        if (handler.validate) {
            this._server.use(method(routePath, handler.validate));
        }

        if (handler.handle) {
            this._server.use(method(routePath, handler.handle));
        }
    };
}

module.exports = KoaServerRouteMediator;
