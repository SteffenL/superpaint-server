"use strict";

// The main data source to use for this application
const dataSourceName = "main";
// The current environment (dev, prod)
const environment = "dev";

let StandardPaths = require("./modules/StandardPaths");
let ConfigProvider = require("./modules/ConfigProvider");
let Application = require("./modules/Application");

let path = require("path");

StandardPaths.instance.configure(__dirname);

let configProvider = new ConfigProvider(
    path.join(__dirname, "base_config"),
    path.join(__dirname, "../config"));
let config = configProvider.get(environment);
let app = new Application(config, dataSourceName, environment);

app.run();
