"use strict";

require("./appContext").instance.configure(__dirname);

const Application = require("./modules/Application");

(new Application()).run();
