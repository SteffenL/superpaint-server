
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable("drawing", table => {
            table.increments("drawing_id").primary().notNullable();
            table.uuid("drawing_uuid").unique().notNullable().comment("UUID (v4) that can be exposed to the public instead of the PK.");
            // We could make the path unique, but we might insert multiple new rows that temporarily leaves the path empty
            table.string("path", 255).notNullable().comment("Relative path to the file.");
            table.string("type", 200).notNullable().comment("MIME type of the file");
            table.bigInteger("size").notNullable().comment("Size of the file");
            table.string("hash", 64).unique().notNullable().comment("A hash (up to 256 bits) of the file, represented as hexadecimals.");
            table.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable("drawing")
    ]);
};
