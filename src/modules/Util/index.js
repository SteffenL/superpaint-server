"use strict";

class Util {
    /**
     * Merges the properties of the source object directly into the base object.
     * @param {Object} base
     * @param {Object} source
     * @returns {Object} The passed-in (and modified) base object.
     */
    static mergeObjectProperties(base, source) {
        for (let k in source) {
            if (source.hasOwnProperty(k)) {
                base[k] = base.hasOwnProperty(k) && source[k].constructor === Object
                    ? this.mergeObjectProperties(base[k], source[k])
                    : source[k];
            }
        }

        return base;
    }
}

module.exports = Util;
