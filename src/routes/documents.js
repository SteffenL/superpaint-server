"use strict";

const appContext = require("../defaultAppContext"),
    dataModels = require("../data/models"),
    pngMatcher = require("../modules/file_identification/formats/images/png"),
    Util = require("../modules/utils"),
    Promise = require("bluebird"),
    BluebirdCo = require('bluebird-co/manual'),
    fs = Promise.promisifyAll(require("fs-extra")),
    sprintf = require("sprintf-js").sprintf,
    Jimp = require("jimp"),
    uuid = require("uuid"),
    crypto = require("crypto"),
    path = require("path"),
    formidable = require("koa-formidable"),
    cloudinary = require("cloudinary"),
    util = require("util");

Promise.coroutine.addYieldHandler(BluebirdCo.toPromise);


class ValidationError extends Error {
    constructor(...args) {
        super(...args);
    }
}


const MAX_RESULTS_PER_PAGE = 50;
const FULL_IMAGE_FILE_EXTENSION = ".png";
const FULL_IMAGE_MIME_TYPE = "image/png";
const DOCUMENTS_RELATIVE_UPLOADS_BASE_DIR = "documents";


class ViewDocumentViewModel {
    constructor(path, uuid) {
        this.id = uuid;
        // Thumbnail image URL
        this.thumbnailUrl = path;
        // Full image URL
        this.fullUrl = path;
    }
}


class RouteHandlers {
    static *list() {
        // TODO: The client should request the amount they want (within the limits).
        // TODO: Add pagination/offset support.
        const limit = 10;
        const offset = 0;

        const models = yield dataModels.Document.query()
            .orderBy("created_at", "asc")
            .select(["document_uuid", "path"])
            .limit(limit)
            .offset(offset);

        let viewModels = Array.from(models, m => new ViewDocumentViewModel(m.path, m.document_uuid));
        this.body = viewModels;
    }

    static *create() {
        const file = this.params.uploadedFile;

        const documentUuid = uuid.v4();

        yield new Promise((resolve, reject) => {
            cloudinary.uploader.upload(file.path, resolve, {
                public_id: util.format("%s/%s", DOCUMENTS_RELATIVE_UPLOADS_BASE_DIR, documentUuid)
            });
        }).then(uploadResult => {
            return new dataModels.Document({
                document_uuid: documentUuid,
                path: uploadResult.secure_url,
                type: file.type,
                size: file.size,
                hash: this.params.hash
            }).save(null);
        });

        this.body = {};
    }
}


class RouteValidators {
    static *create(next) {
        const form = yield formidable.parse(this);
        const file = form.files.contents || null;
        this.params.uploadedFile = file;

        const cleanup = function*() {
            if (file) {
                return fs.statAsync(file.path).then((stats) => {
                    return fs.unlinkAsync(file.path);
                });
            };
        };

        try {
            yield RouteValidators._validateUploadedPngImage(this, file);
            // TODO: Strip unnecessary metadata as well as junk at the end of the file (possibly malicious)?
            //yield cleanup();
            yield next;
        }
        catch (ex) {
            if (ex instanceof ValidationError) {
                cleanup();
                this.throw(400, ex.message);
                return;
            }

            throw ex;
        }
    }

    static _validateUploadedPngImage(this_, file) {
        if (!file) {
            throw new ValidationError("File contents are missing");
        }

        const limits = appContext.config.policies.document.uploadLimits;
        if (!Util.Geometry.within(file.size, limits.fileSize.min, limits.fileSize.max)) {
            throw new ValidationError(sprintf(
                "The file must have a size between %1$d and %2$d bytes (inclusive)",
                limits.fileSize.min, limits.fileSize.max));
        }

        if (file.type !== FULL_IMAGE_MIME_TYPE) {
            throw new ValidationError("MIME type is not allowed");
        }

        return RouteValidators._validatePngImageFile(file.path).then(isValid => {
            if (!isValid) {
                throw new ValidationError("Unsupported file format");
            }
        }).then(() => {
            // TODO: This process seems to perform quite poorly, so look into replacing Jimp
            return Jimp.read(file.path).then(image => {
                this_.params.image = image;

                const b = image.bitmap;
                const l = limits.imageSize;
                const dimensionsAreAllowed =
                    (b.width >= l.width.min) && (b.width <= l.width.max) &&
                    (b.height >= l.height.min) && (b.height <= l.height.max);

                if (!dimensionsAreAllowed) {
                    throw new ValidationError("Image dimensions are not allowed");
                }
            }).catch(ex => {
                if (ex instanceof ValidationError) {
                    throw ex;
                }

                // TODO: Check whether there are any specific exceptions related to the image processor that we can catch, to avoid throw away other errors 
                //throw new ValidationError("Failed to process the image");
            });
        })
        // TODO: Do a virus scan. It should preferably work on multiple platforms.
        .then(() => {
            // Make sure the file has not already been uploaded
            // TODO: We should normally not load the whole file into memory, so let's not do it
            return fs.readFileAsync(file.path).then(buffer => {
                return crypto.createHash("sha256").update(buffer).digest("hex");
            }).then(hash => {
                this_.params.hash = hash;
                return dataModels.Document.where("hash", hash).count();
            }).then(count => {
                if (count > 0) {
                    throw new ValidationError("File has already been uploaded");
                }
            });
        });
    }

    static _validatePngImageFile(filePath) {
        return Promise.try(() => {
            return fs.openAsync(filePath, "r");
        }).then(fd => {
            const bytesNeeded = pngMatcher.getBytesNeeded();
            return fs.readAsync(fd, new Buffer(bytesNeeded), 0, bytesNeeded, 0);
        }).then(result => {
            const bytesRead = result[0];
            const buffer = result[1];

            if (bytesRead !== pngMatcher.getBytesNeeded()) {
                throw Error(`Failed to read ${bytesRead} bytes`);
            }

            return pngMatcher.matches(buffer);
        });
    }
}


const tempExports = {
    "/documents": {
        get: {
            handle: RouteHandlers.list,
        },
        post: {
            handle: RouteHandlers.create,
            validate: RouteValidators.create
        }
    }
};

module.exports = tempExports;
