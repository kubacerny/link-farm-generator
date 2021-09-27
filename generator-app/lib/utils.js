const createHash = require('crypto').createHash;
const Crc32 = require('@aws-crypto/crc32').Crc32;

module.exports = {
    getPageHashIndexFromURL(urlPathInclSearch) {
        return createHash('sha512').update(urlPathInclSearch).digest('base64');
    },
    getCRC32(text) {
        return (new Crc32).update(text).digest();
    },
    // used to generate random text from hash.
    // other option is to use rand generator with hash as a seed
    getSHA512(text) {
        return createHash('sha512').update(text).digest('base64');
    }
}