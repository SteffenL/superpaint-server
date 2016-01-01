"use strict";

/**
 * A utility class for geometric calculations.
 */
class GeometryUtil {
    static within(point, min, max, inclusive) {
        inclusive = inclusive === undefined;
        return inclusive
            ? point >= min && point <= max
            : point > min && point < max;
    }
}

module.exports = GeometryUtil;
