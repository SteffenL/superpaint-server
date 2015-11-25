"use strict";

class ObjectUtil {
    /**
     * Merges the properties of the source object directly into the base object.
     * @param {Object} base
     * @param {Object} source
     * @returns {Object} The passed-in (and modified) base object.
     */
    static mergeProperties(base, source) {
        for (let k in source) {
            if (source.hasOwnProperty(k)) {
                base[k] = base.hasOwnProperty(k) && source[k].constructor === Object
                    ? this.mergeProperties(base[k], source[k])
                    : source[k];
            }
        }

        return base;
    }
}

module.exports = ObjectUtil;
