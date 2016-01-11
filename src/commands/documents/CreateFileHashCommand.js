"use strict";

const Promise = require("bluebird"),
    fs = Promise.promisifyAll(require("fs")),
    crypto = require("crypto");

class CreateFileHashCommand {
    constructor(filePath) {
        this._filePath = filePath;
        this._validate();
    }

    execute() {
        // TODO: We should normally not load the whole file into memory, so let's not do it
        return fs.readFileAsync(this._filePath).then(buffer => {
            return crypto.createHash("sha256").update(buffer).digest("hex");
        });
    }

    _validate() {
        // TODO: file exists?
    }
}

module.exports = CreateFileHashCommand;
