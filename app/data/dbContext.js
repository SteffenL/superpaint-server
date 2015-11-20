var Promise = require("bluebird");
var Sequelize = require("sequelize");
var path = require("path");


/**
 * A quick and dirty way to construct an instance of Sequilize with a data source configuration.
 * TODO: Make this modular.
 */
function SequelizeFactory() {
    this._dataStoreDir = path.join(__dirname, "../../data_store");
}

SequelizeFactory.prototype.create = function(dataSource) {
    switch (dataSource.type) {
        case "sqlite":
            return new Sequelize(
                dataSource.database,
                dataSource.username,
                dataSource.password,
                {
                    dialect: "sqlite",
                    storage: path.join(this._dataStoreDir, dataSource.database + ".db"),
                    charset: "utf8",
                    // TODO: Allow user to override logging
                    logging: false
                })

        default:
            throw new Error("Invalid data source type: " + dataSource.type);
    }
};



function DbContext() {
    this._sequelize = null;
}

/**
 * @param dataSource Data source configuration.
 * @param {Boolean} syncDatabase Whether to synchronize the database and current schemas.
 * @return {Promise}
 */
DbContext.prototype.configure = function(dataSource, syncDatabase) {
    return new Promise(function(resolve, reject) {
        console.log("Setting up database context...");

        this._sequelize = (new SequelizeFactory()).create(dataSource);

        var schemaDescriptors = null;
        try {
            schemaDescriptors = require("require-all")(path.join(__dirname, "schemas"));
        }
        catch (ex) {
            console.error("Failed to load database schemas");
            throw ex;
        }

        this.models = new ModelTypeProvider(this._sequelize, schemaDescriptors);

        if (syncDatabase) {
            this._sequelize.sync().then(function() {
                console.log("Synchronized database schemas.");
                resolve();
            });
        }
        else {
            resolve();
        }
    }.bind(this));
};

DbContext.prototype.sequelize = function() {
    return this._sequelize;
};


/**
 * Provides Sequelize model types via properties to group them together.
 * You can easily instantiate like this:
 * var models = require(..this file..);
 * var document = new models.ModelName();
 * 
 * @param schemaDescriptors Array of Sequelize schema descriptors.
 */
function ModelTypeProvider(sequelize, schemaDescriptors) {
    for (var name in schemaDescriptors) {
        if (schemaDescriptors.hasOwnProperty(name)) {
            var schema = schemaDescriptors[name].schema;
            var options = schemaDescriptors[name].options;
            this[name] = sequelize.define(name, schema, options);
        }
    }
}


module.exports = new DbContext();
