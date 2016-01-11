"use strict";

const dataModels = require("../../data/models"),
    appContext = require("../../defaultAppContext"),
    CreateFileHash = require("./CreateFileHashCommand"),
    Promise = require("bluebird"),
    cloudinary = require("cloudinary"),
    uuid = require("uuid"),
    fs = Promise.promisifyAll(require("fs")),
    path = require("path");

class CreateDocumentCommand {
    constructor(filePath, fileType) {
        this._filePath = filePath;
        this._fileType = fileType;
        this._validate();
    }

    execute() {
        const documentUuid = uuid.v4();
        
        let fileSize = 0;
        let newPath = null;
        let fileHash = null;

        return this._getFileHash(this._filePath).then(hash => {
            fileHash = hash;
            return fs.statAsync(this._filePath);
        }).then(stats => {
            fileSize = stats.size;
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(this._filePath, uploadResult => { resolve(uploadResult); }, {
                    public_id: this._makeDocumentPathFromUuid(documentUuid)
                });
            });
        }).then(uploadResult => {
            newPath = uploadResult.secure_url;
            return new dataModels.Document({
                document_uuid: documentUuid,
                path: newPath,
                type: this._fileType,
                size: fileSize,
                hash: fileHash
            }).save(null);
        });
    }

    _validate() {
        // TODO: file exists?
    }

    _getFileHash(filePath) {
        const command = new CreateFileHash(filePath);
        return command.execute();
    }

    _makeDocumentPathFromUuid(uuid) {
        if (!appContext.config.uploads.relativeDocumentsDir) {
            throw new Error("Documents directory is not configured");
        }

        return path.posix.join(appContext.config.uploads.relativeDocumentsDir, uuid);
    }
}

module.exports = CreateDocumentCommand;
