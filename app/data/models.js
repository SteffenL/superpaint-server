console.log("Loading database models...");

var path = require("path");
var Sequelize = require("sequelize");

/**
 * Provides Sequelize model types via properties to group them together.
 * You can easily instantiate like this:
 * var models = require(..this file..);
 * var document = new models.ModelName();
 * 
 * @param schemaDescriptors Array of Sequelize schema descriptors.
 */
function ModelTypeProvider(schemaDescriptors) {
    for (var name in schemaDescriptors) {
        if (schemaDescriptors.hasOwnProperty(name)) {
            var schema = schemaDescriptors[name];
            this[name] = sequelize.define(name, schema);
        }
    }
}


// Load mongoose schema descriptor dynamically
var schemaDescriptors = require("require-all")(path.join(__dirname, "schemas"));
var typeProvider = new ModelTypeProvider(schemaDescriptors);
module.exports = typeProvider;
