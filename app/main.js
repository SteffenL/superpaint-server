// Set the application configuration to use
var configProvider = require("./config");
// Set the main data source to use for this application
var dataSourceName = "main";
// The current environment (dev, prod)
var environment = "dev";

var config = configProvider.configure(environment).get();
var Application = require("./application.js");
(new Application(config, dataSourceName, environment)).run();
