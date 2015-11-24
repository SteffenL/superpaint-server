"user strict";

// The main data source to use for this application
var dataSourceName = "main";
// The current environment (dev, prod)
var environment = "dev";

var configProvider = require("./config");
var Application = require("./application.js");

var config = configProvider.get(environment);
(new Application(config, dataSourceName, environment)).run();
