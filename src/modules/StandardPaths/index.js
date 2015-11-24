"use strict";

class StandardPaths {
	constructor() {
		this._appDir = null;
	}

	static get instance() {
		if (!StandardPaths._instance) {
			StandardPaths._instance = new StandardPaths();
		}

		return StandardPaths._instance;
	}

	configure(appDir) {
		this._appDir = appDir;
	}

	static get appDir() {
		return StandardPaths.instance._appDir;
	}
}

StandardPaths._instance = null;

module.exports = StandardPaths;
