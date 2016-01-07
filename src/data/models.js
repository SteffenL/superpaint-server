"use strict";

const appContext = require("../defaultAppContext");

const Document = appContext.bookshelf.Model.extend({
    tableName: "document",
    idAttribute: "document_id",
    hasTimestamps: true
});

module.exports = {
    Document: Document
};
