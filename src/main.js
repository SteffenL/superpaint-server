"use strict";

require("./appContext").configure(__dirname);

let Application = require("./modules/Application");

(new Application()).run();
