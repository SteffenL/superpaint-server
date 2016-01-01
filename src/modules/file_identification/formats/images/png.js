"use strict";

const PNG_SIGNATURE = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
const PNG_SIGNATURE_LENGTH = PNG_SIGNATURE.length;

/**
 * A class that attempts to identify binary data as a PNG image.
 */
class Matcher {
    /**
     * Returns a the number of bytes needed in the passed-in buffer.
     */
    getBytesNeeded() {
        return PNG_SIGNATURE_LENGTH;
    }

    /**
     * Reads from the stream and attempts to identify the data. Make sure the buffer is long enough.
     */
    matches(buffer) {
        const bytesNeeded = this.getBytesNeeded();
        if (buffer.length < bytesNeeded) {
            throw new Error(`Buffer must be at least ${bytesNeeded} bytes long`);
        }

        const signature = buffer.slice(0, PNG_SIGNATURE_LENGTH);
        const expectedSignature = new Buffer(PNG_SIGNATURE);
        // Signature mismatch?
        if (signature.compare(expectedSignature) !== 0) {
            return false;
        }

        return true;
    }
}

module.exports = new Matcher();
