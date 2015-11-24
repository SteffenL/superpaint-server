"use strict";

let Routes = require("../Routes");
let StandardPaths = require("../StandardPaths");
let KoaServerRouteMediator = require("../KoaServerRouteMediator");

let fs = require("fs");
let http = require("http");
let https = require("https");
let koa = require("koa");
let path = require("path");

let koaApp = koa();

class Application {
	constructor(config, dataSourceName, environment) {
		this._config = config;
		this._dataSourcename = dataSourceName;
		this._environment = environment;
		this._routes = new Routes(path.join(StandardPaths.appDir, "routes"));
	}

	/**
	 * Runs this application.
	 */
	run() {
		const config = this._config;
		this._createServer(config.server.httpsPort, {
			key: fs.readFileSync(config.server.ssl.keyPath),
			cert: fs.readFileSync(config.server.ssl.certificatePath)
		}).then(() => {
			console.log("Server is up.");
		});
	}

	/**
	 * Creates a server instance (using Koa) and starts listening.
	 * @param  listenPort    The port number to listen on.
	 * @param  serverOptions Optional configuration for the server (see ? docs).
	 * @returns {Promise}
	 */
	_createServer(listenPort, serverOptions) {
		let server = https.createServer(serverOptions, koaApp.callback());
		this._routes.assignToServer(new KoaServerRouteMediator(server));
		return new Promise((resolve, reject) => {
			server.listen(listenPort, () => {
				console.log("Listening on port " + listenPort);
			});
		});
	}
}

module.exports = Application;
