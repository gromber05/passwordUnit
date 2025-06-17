
const bcrypt = require("bcryptjs"); // Password encrypter
/**
 * Encrypts the given password.
 * 
 * @param {string} password - Generated password to encrypt.
 * @returns {string} - The encrypted password
 */
function encrypt(password) {
  return bcrypt.hashSync(password, 10);
}

/**
 * Encrypts the given password.
 * 
 * @param {string} password - Generated password to encrypt.
 * @returns {string} - The encrypted password
 */
function decrypt(password) {
  return bcrypt.decodeBase64(password, 10);
}

module.exports = {
    encrypt,
    decrypt
}