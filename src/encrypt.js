import crypto from "crypto";

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync('your-secret-key', 'salt', 32);

/**
 *  Encrypts a given text using a symmetric encryption algorithm.
 *
 *  @param {string} text - The plaintext string to encrypt.
 *  @returns {string} The encrypted data in the format "iv:encrypted", where both are hex-encoded.
 */
function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

/**
 *  Decrypts an encrypted string using the specified algorithm and key.
 *
 *  @param {string} encrypted - The encrypted string in the format "iv:encryptedText", where `iv` is the initialization vector in hex and `encryptedText` is the encrypted data in hex.
 *  @returns {string} The decrypted plaintext string.
 */
function decrypt(encrypted) {
    const [ivHex, encryptedText] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export { encrypt, decrypt };