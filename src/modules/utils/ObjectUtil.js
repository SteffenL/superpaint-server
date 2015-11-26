"use strict";

/**
 * A utility class for objects.
 */
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

    /**
     * Copies the properties of the source object into a new object.
     * @param {Object} source
     * @returns {Object} A new copy of the source.
     */
    static copyProperties(source) {
        let result = {};
        for (let k in source) {
            if (source.hasOwnProperty(k)) {
                result[k] = source[k] && source[k].constructor === Object
                    ? this.copyProperties(source[k])
                    : Object.assign({}, source[k]);
            }
        }

        return result;
    }
}

module.exports = ObjectUtil;
