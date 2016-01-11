"use strict";

const dataModels = require("../../data/models");

class GetDocumentsWithPaginationCommand {
    constructor(offset, limit) {
        this._offset = offset;
        this._limit = limit;
        this._validate();
    }

    execute() {
        return dataModels.Document.query()
            .orderBy("created_at", "asc")
            .select(["document_uuid", "path"])
            .limit(this._limit)
            .offset(this._offset);
    }

    _validate() {
        if (this._limit < 1) {
            throw new Error("Limit must be greater than 0.");
        }
    }
}

module.exports = GetDocumentsWithPaginationCommand;
