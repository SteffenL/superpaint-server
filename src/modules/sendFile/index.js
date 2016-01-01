"use strict";

const Promise = require("bluebird"),
    fs = Promise.promisifyAll(require("fs")),
    path = require("path");


/**
 * Options used when sending files to the client.
 */
class SendFileOptions {
    constructor() {
        // Override MIME type or file extension
        this.type = null;
        // Use cache control when possible?
        this.useCacheControl = true;
    }
}


/**
 * Sends a file on the local file system to the client.
 * @param                    context  An instance of a Koa context.
 * @param {String}           path     Path to the file.
 * @param {SendFileOptions}  options  Optional configuration.
 * @returns {Promise}
 */
function sendFile(context, path, options) {
    options = Object.assign(new SendFileOptions(), options);
    return fs.statAsync(path).then(stats => {
        if (!stats.isFile()) {
            throw new Error(`Must be a file: ${path}`);
        }

        const type = options.type ? options.type : path.extname(path);

        context.response.lastModified = stats.mtime;
        context.response.length = stats.size;
        context.response.type = type;

        // TODO: Generate ETag?

        if (context.request.fresh && options.useCacheControl) {
            // Cache is still good
            context.response.status = 304;
            return;
        }

        context.response.status = 200;

        if (context.request.method === "GET") {
            // Send off the file
            context.body = fs.createReadStream(path);
        }
    });
}

module.exports = sendFile;
