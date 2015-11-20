var Sequelize = require("sequelize");

module.exports = {
    schema: {
        drawingId: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        drawingUuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            unique: true,
            comment: "UUID that can be exposed to the public instead of the PK."
        },
        contents: {
            type: Sequelize.BLOB,
            allowNull: false,
            comment: "The contents of the drawing."
        },
        hash: {
            type: Sequelize.STRING(64),
            unique: true,
            allowNull: false,
            unique: true,
            comment: "A hash (up to 256 bits) of the contents of the drawing, represented as hexadecimals."
        }
        /*hashHex: {
            type: Sequelize.STRING(256),
            unique: true,
            allowNull: false,
            unique: true,
            charset: "ascii",
            comment: "A hash of the contents of the drawing, represented as hexadecimals. Max hash length in bits = hex string length/2*8. In this case, Up to 1024 bits in this case."
        }*/
    },
    options: {
    }
};
