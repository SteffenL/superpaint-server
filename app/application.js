var fs = require("fs");
var restify = require("restify");
var Promise = require("bluebird");
var routes = require("./routes");


/**
 * Avoids crashing and shutting down the server by returning a status code to the client, and a message if it's an HTTP error.
 */
function restifyExceptionHandler(req, res, route, err) {
    // Return HTTP errors to the client
    if (err instanceof restify.HttpError) {
        return res.send(err);
    }

    // TODO: Log internal errors

    if (typeof err === "string" || err instanceof String) {
        console.error("Unhandled exception: " + err);
    }
    else {
        var stack = err.hasOwnProperty("stack") ? err.stack : "(stack trace not available)";
        console.error("Unhandled exception", stack);
    }

    res.send(500);
}

function logRequest(request, result, next) {
    console.log("Request:", JSON.stringify({
        url: request.url,
        method: request.method,
        headers: request.headers
    }));

    next();
}


/**
 * @param config         The configuration to use.
 * @param dataSourceName The data source to use from the configuration.
 * @param environment    The environment to use when choosing the configuration.
 */
function Application(config, dataSourceName, environment) {
    this._config = config;
    this._dataSourceName = dataSourceName;
    this._environment = environment;
}

/**
 * Does plumbing and starts the server.
 * @throws If the specified data source was not found in the configuration.
 * @return {Promise}
 */
Application.prototype.run = function() {
    Promise.onPossiblyUnhandledRejection(function(e, promise) {
        throw e;
    });

    var dbContext = require("./data/dbContext.js");
    var config = this._config;

    if (!config.dataSources.hasOwnProperty(this._dataSourceName)) {
        throw new Error("Invalid data source name: " + this._dataSourceName);
    }

    var this_ = this;
    return dbContext.configure(config.dataSources[this_._dataSourceName], config.database.sync)
        .then(function() {
            return this_._createServer(config.server.httpsPort, {
                key: fs.readFileSync(config.server.ssl.keyPath),
                certificate: fs.readFileSync(config.server.ssl.certificatePath)
            })
        })
        .then(function() {
            console.log("Server is up.");
        });
};

/**
 * Creates a server instance (using restify) and starts listening.
 * @param  listenPort    The port number to listen on.
 * @param  serverOptions Optional configuration for the server (see restify docs).
 * @return {Promise}
 */
Application.prototype._createServer = function(listenPort, serverOptions) {
    return new Promise(function(resolve, reject) {
        var server = restify.createServer(serverOptions);

        server.on("uncaughtException", restifyExceptionHandler);

        server.pre(logRequest);

        server.use(restify.acceptParser(server.acceptable));
        server.use(restify.bodyParser());
        server.use(restify.CORS());

        routes.setupRoutes(server);

        server.listen(listenPort, function() {
            console.log("Listening at %s", server.url);
            resolve();
        });
    });
}

module.exports = Application;
