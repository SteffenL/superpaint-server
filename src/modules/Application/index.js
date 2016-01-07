"use strict";

const Routes = require("../routes/Routes"),
    KoaServerRouteMediator = require("../routes/route_mediators/KoaServerRouteMediator"),
    appContext = require("../../appContext"),
    formidable = require("koa-formidable"),
    path = require("path"),
    fs = require("fs"),
    http = require("http"),
    https = require("https"),
    koa = require("koa");

const koaApp = koa();

class Application {
    /**
     * TODO: doc
     */
    constructor() {
        this._routes = new Routes(appContext.routesDir);
    }

    /**
     * Runs this application.
     */
    run() {
        const serverConfig = appContext.config.server;

        let port = appContext.portOverride;
        if (!port) {
            port = serverConfig.useHttps ? serverConfig.httpsPort : serverConfig.httpPort;
        }

        const serverFactory = serverConfig.useHttps
            ? function() {
                const serverOptions = {
                    key: serverConfig.useHttps ? fs.readFileSync(serverConfig.ssl.keyPath) : null,
                    cert: serverConfig.useHttps ? fs.readFileSync(serverConfig.ssl.certificatePath) : null
                };
                return https.createServer(serverOptions, koaApp.callback());
            }
            : function() {
                return http.createServer(koaApp.callback());
            };
        this._createServer(port, serverFactory).then(() => {
            console.log("Server is up.");
        });
    }

    /**
     * Creates a server instance (using Koa) and starts listening.
     * @param  listenPort    The port number to listen on.
     * @param  serverOptions Optional configuration for the server (see Node.js docs for http/https modules).
     * @returns {Promise}
     */
    _createServer(listenPort, serverFactory) {
        const server = serverFactory();
        //koaApp.use(formidable());
        this._routes.assignToServer(new KoaServerRouteMediator(koaApp));
        return new Promise((resolve, reject) => {
            server.listen(listenPort, () => {
                console.log("Listening on port " + listenPort);
                resolve();
            });
        });
    }
}

module.exports = Application;
