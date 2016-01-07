"use strict";

const appContext = require("../appContext");

const Drawing = appContext.bookshelf.Model.extend({
    tableName: "drawing",
    idAttribute: "drawing_id",
    hasTimestamps: true
});

module.exports = {
    Drawing: Drawing
};
