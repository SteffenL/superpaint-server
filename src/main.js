"use strict";

require("./appContext").instance.configure(__dirname);

let Application = require("./modules/Application");

(new Application()).run();
