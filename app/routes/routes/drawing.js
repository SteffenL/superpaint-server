var dbContext = require("../../data/dbContext.js");
var config = require("../../config").get();

var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var crypto = require("crypto");
var lwip = require("lwip");
var restify = require("restify");
var util = require("util");

module.exports = {
    "/drawing": {
        get: function(request, response, next) {
            dbContext.models.Drawing.findAll({ attributes: { include: ["drawingUuid"] }})
                .then(function(models) {
                    var viewModels = [];
                    models.forEach(function(model) {
                        viewModels.push({
                            id: model.drawingUuid
                        });
                    });

                    response.send(viewModels);
                    next();
                });
        },
        post: function(request, response, next) {
            if (!request.files.drawing) {
                throw new restify.BadRequestError("File to upload is missing");
            }

            var uploadLimits = config.businessRules.drawing.upload.limits;
            var tempFilePath = request.files.drawing.path;

            fs.statAsync(tempFilePath)
                .then(function(stats) {
                    // Validate file size
                    if (stats.size < uploadLimits.minFileSize || stats.size > uploadLimits.maxFileSize) {
                        throw new restify.BadRequestError(util.format(
                            "The file must have a size between %d and %d (inclusive).",
                            uploadLimits.minFileSize, uploadLimits.maxFileSize));
                    }
                })
                .then(function() {
                    // Validate file contents (quick)
                    // TODO: Validate returned fd to make sure the call succeeded
                    return fs.openAsync(tempFilePath, "r")
                        .then(function(fd) {
                            var PNG_SIGNATURE = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
                            var PNG_SIGNATURE_LENGTH = PNG_SIGNATURE.length;

                            var actualSignature = new Buffer(PNG_SIGNATURE_LENGTH);
                            return fs.readAsync(fd, actualSignature, 0, PNG_SIGNATURE_LENGTH, 0)
                                .then(function(bytesRead) {
                                    if (bytesRead != PNG_SIGNATURE_LENGTH) {
                                        throw new Error("Failed to read from file: " + tempFilePath);
                                    }

                                    // TODO: Check the amount read?
                                    var expectedSignature = new Buffer(PNG_SIGNATURE);
                                    // Signature mismatch?
                                    if (actualSignature.compare(expectedSignature) != 0) {
                                        throw new restify.BadRequestError("Only PNG images are currently supported.");
                                    }

                                    // TODO: Strip unnecessary metadata as well as junk at the end of the file (possibly malicious)?
                                });
                        })
                })
                .then(function() {
                    return new Promise(function(resolve, reject) {
                        try {
                            lwip.open(tempFilePath, function(err, image) {
                                console.log(image);
                                if (err) throw restify.BadRequestError("Failed to open the image");

                                console.log(util.format("%d,%d", image.width, image.height));

                                // Validate image dimensions
                                if (image.width < uploadLimits.minDimensions.x || image.width > uploadLimits.maxDimensions.x
                                    || image.height < uploadLimits.minDimensions.y || image.height > uploadLimits.maxDimensions.y) {
                                    throw new restify.BadRequestError(util.format(
                                        "The image must have dimensions between %dx%d and %dx%d (inclusive).",
                                        uploadLimits.minDimensions.x, uploadLimits.minDimensions.y, uploadLimits.maxDimensions.x, uploadLimits.maxDimensions.y));
                                }

                                resolve(image);
                            });
                        }
                        catch (ex) {
                            console.error("Failed to open the image: ", ex);
                            throw new restify.BadRequestError("Failed to open the image");
                        }
                    });
                })
                .then(function(image) {
                    console.log("ok");
                    response.send({});
                    next();
                });
        }
    }
};