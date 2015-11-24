"use strict";

class DrawingRouteHandlers {
    static *list(context) {
        let model = {
            id: ""
        };
        
        this.body = model;
    }
    
    static *upload(context) {
        
    }
    
    static *view(context, uuid) {
        let model = {
            id: ""
        };
        
        this.body = model;
    }
}

let handlers =  DrawingRouteHandlers;

module.exports = {
    "/drawing": {
        get: handlers.list,
        post: handlers.upload,
    },
    "/drawing/:uuid": {
        get: handlers.view
    }
};
