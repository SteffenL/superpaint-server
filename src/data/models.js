"use strict";

let appContext = require("../appContext").instance;

module.exports = {
    Drawing: appContext.bookshelf.Model.extend({
        tableName: "drawing"
    })
};
