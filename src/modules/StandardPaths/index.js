"use strict";

class StandardPaths {
    /**
     * TODO: doc
     */
    constructor() {
        this._appDir = null;
    }

    /**
     * Gets the global instance of this class.
     * @returns {StandardPaths}
     */
    static get instance() {
        if (!StandardPaths._instance) {
            StandardPaths._instance = new StandardPaths();
        }

        return StandardPaths._instance;
    }

    /**
     * TODO: doc
     */
    configure(appDir) {
        this._appDir = appDir;
    }

    /**
     * Gets the application directory as passed in by the application (necessarily reliable).
     * @returns {String}
     */
    static get appDir() {
        return StandardPaths.instance._appDir;
    }
}

StandardPaths._instance = null;

module.exports = StandardPaths;
