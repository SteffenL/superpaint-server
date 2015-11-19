var fs = require("fs");
var restify = require("restify");
var Promise = require("bluebird");
var routes = require("./routes");

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
 */
Application.prototype.run = function() {
    var dbContext = require("./data/dbContext.js");
    var config = this._config;

    if (!config.dataSources.hasOwnProperty(this._dataSourceName)) {
        throw new Error("Invalid data source name: " + this._dataSourceName);
    }

    dbContext.configure(config.dataSources[this._dataSourceName]);

    this._createServer(
        config.server.httpsPort,
        {
            key: fs.readFileSync(config.server.ssl.keyPath),
            certificate: fs.readFileSync(config.server.ssl.certificatePath)
        }
    ).then(function() {
        return this._createServerRedirectingToHttps(config.server.httpPort);
    }.bind(this)).then(function() {
        console.log("Server is up.");
    });
};

/**
 * Creates a server instance (using restify) and starts listening.
 * @param  listenPort    The port number to listen on.
 * @param  serverOptions Optional configuration for the server (see restify docs).
 * @return The new server instance.
 */
Application.prototype._createServer = function(listenPort, serverOptions) {
    return new Promise(function(resolve, reject) {
        var server = restify.createServer(serverOptions);
        
        server.use(restify.acceptParser(server.acceptable));
        server.use(restify.bodyParser());
        server.use(restify.CORS());

        routes.setupRoutes(server);

        server.listen(listenPort, function() {
            console.log("Listening at %s", server.url);
            resolve(server);
        });
    });
}

/**
 * Creates a server (using restify) for unencrypted requests, and redirects all requests to use encrypted connections.
 * @param  port The port number to listen on.
 */
Application.prototype._createServerRedirectingToHttps = function(port) {
    return new Promise(function(resolve, reject) {
        var server = restify.createServer();

        server.pre(function(request, result, next) {
            // Redirect to HTTPS
            if (!request.isSecure()) {
                // TODO: Check whether non-standard ports are included in the host header, and remove/replace them.
                var secureUrl = "https://" + request.header("host") + request.url;
                result.redirect(301, secureUrl, next);
                return;
            }

            return next();
        });

        server.listen(port, function() {
            console.log("Listening at %s", server.url);
            resolve(server);
        });
    });
}

module.exports = Application;
