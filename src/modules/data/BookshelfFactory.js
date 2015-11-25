"use strict";

let bookshelfFactory = require("bookshelf");
let KnexFactory = require("./KnexFactory");

class BookshelfFactory {
    constructor() {
        this._dataSource = null;
        this._knex = null;
        this._bookshelf = null;
    }

    static configure(dataSource) {
        this._dataSource = dataSource;
        this._knex = KnexFactory.create(this._dataSource);
        this._bookshelf = bookshelfFactory(this._knex);
    }

    get knex() {
        return this._knex;
    }

    get bookshelf() {
        return this._bookshelf;
    }
}

module.exports = BookshelfFactory;
