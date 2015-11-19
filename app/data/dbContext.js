var Sequelize = require("sequelize");

function DbContext() {
    this._sequelize = null;
}

DbContext.prototype.configure = function(dataSource) {
    this._sequelize = new Sequelize(
            dataSource.database,
            dataSource.username,
            dataSource.password,
            dataSource.options);
    return this._sequelize;
};

DbContext.prototype.sequelize = function() {
    return this._sequelize;
};

module.exports = new DbContext();
