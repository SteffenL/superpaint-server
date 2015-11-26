"use strict";

let appContext = require("../appContext").instance;
let dataModels = require("../data/models");

class DrawingRouteHandlers {
    static *list() {
        let viewModels = [];

        let collection = yield dataModels.Drawing
            .query("orderBy", "created_at", "asc")
            .fetchAll();

        console.log(collection);
        /*for (let model of collection) {
            console.log(model);
        }*/

        /*let viewModel = {
            id: 
        };*/

        this.body = viewModels;
    }

    static *create() {

    }

    static *read(uuid) {
        let viewModel = {
        };

        this.body = viewModel;
    }
}

let Handlers = DrawingRouteHandlers;

module.exports = {
    "/drawing": {
        get: Handlers.list,
        post: Handlers.create,
    },
    "/drawing/:uuid": {
        get: Handlers.read
    }
};
