"use strict";

let bookshelfFactory = require("bookshelf");
let KnexFactory = require("./KnexFactory");

class BookshelfFactory {
    constructor() {
        this._dataSource = null;
        this._knex = null;
        this._bookshelf = null;
    }

    static create(dataSource) {
        this._dataSource = dataSource;
        this._knex = KnexFactory.create(this._dataSource);
        this._bookshelf = bookshelfFactory(this._knex);
        return this._bookshelf;
    }
}

module.exports = BookshelfFactory;
