/*!
 * Copyright (c) 2024 Jonathan Gillman (jonathan-gillman.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * If you find this code useful, please consider donating to feed the developer via Venmo: @Jonathan-Gillman01
 */

const alphabetArray = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
let typeWriterTimeoutId; // Timeout ID for the message typewriter animation.

const keyRequiredLength = 32; // 256 bits / 8 bits per character
let keyPattern = /^[A-Za-z0-9]{32}$/; // Only allow alphanumeric characters
let isFormValid = true;

const alphabetValues = document.getElementById('alphabet-values');
const secretKey = document.getElementById('secret-key');
const plainTextMessage = document.getElementById('plaintext-message');
const encryptedResults = document.getElementById('encrypted-results');
const encryptedMessage = document.getElementById('encrypted-message');
const decryptedResults = document.getElementById('decrypted-results');

const errorAlphaValues = document.getElementById('error-alpha-values');
const errorSecretKey = document.getElementById('error-secret-key');
const errorPlaintextMessage = document.getElementById('error-plaintext-message');
const errorEncryptedResults = document.getElementById('error-encrypted-results');
const errorEncryptedMessage = document.getElementById('error-encrypted-message');
const errorDecryptedResults = document.getElementById('error-decrypted-results');

const copyTextEncryptedResults = document.getElementById('copy-text-encrypted-results');
const copyTextDecryptedResults = document.getElementById('copy-text-decrypted-results');

/*
* @description Encrypts a message using a substitution cipher.
* @param {string} message - The message to encrypt.
* @param {object} alphabetMapping - The alphabet mapping to use for encryption.
* @returns {string} The encrypted message.
*/
function encryptSubstitutionCipher(message) {

    // Create the alphabet mapping using the variable alphabet values.
    const alphabetMapping = createAlphabetMapping(alphabetValues.value, true);

    let encryptedMessage = '';

    for (let i = 0; i < message.length; i++) {
        const char = message[i];
        const isUpperCase = char === char.toUpperCase();
        const lowerChar = char.toLowerCase();

        // Check if the character is in the alphabet mapping.
        if (alphabetMapping[lowerChar]) {
            // Get the mapped character from the alphabet mapping.
            const mappedChar = alphabetMapping[lowerChar];
            // If the original character was uppercase, convert the mapped character to uppercase.
            encryptedMessage += isUpperCase ? mappedChar.toUpperCase() : mappedChar;
        } else {
            encryptedMessage += char; // If character is not in the alphabet mapping, keep it as is.
        }
    }

    return encryptedMessage;
}

/*
* @description Creates a substitution cipher for a message.
* @param {string} message - The message to create a substitution cipher for.
* @param {object} alphabetMapping - The alphabet mapping to use for encryption.
* @returns {string} The substitution cipher.
*/
function decryptSubstitutionCipher(message) {

    // Create the alphabet mapping using the variable alphabet values.
    const alphabetMapping = createAlphabetMapping(alphabetValues.value, false);

    let decryptedMessage = '';

    for (let i = 0; i < message.length; i++) {
        const char = message[i];
        const isUpperCase = char === char.toUpperCase();
        const lowerChar = char.toLowerCase();

        // Check if the character is in the alphabet mapping.
        if (alphabetMapping[lowerChar]) {
            // Get the mapped character from the alphabet mapping.
            const mappedChar = alphabetMapping[lowerChar];
            // If the original character was uppercase, convert the mapped character to uppercase.
            decryptedMessage += isUpperCase ? mappedChar.toUpperCase() : mappedChar;
        } else {
            decryptedMessage += char; // If character is not in the alphabet mapping, keep it as is.
        }
    }

    return decryptedMessage;
}

/*
* @description Checks if a string has duplicate characters.
* @param {string} str - The string to check.
* @returns {boolean} True if the string has duplicates, false otherwise.
*/
function hasDuplicates (str) {
    return /(.).*\1/.test(str);
}

/*
* @description Sets an error message and focuses on the input element.
* @param {object} errLabelElement - The error label element to set the error message.
* @param {string} message - The error message to set.
* @param {object} focusInputElement - The input element to focus on.
*/
function setErrorAndFocus(errLabelElement, message, focusInputElement) {
    errLabelElement.textContent = message;
    isFormValid = false;
    focusInputElement.focus();
}

/*
* @description Sets up the alphabetMapping required to encrypt or decrypt a substitution cipher.
* @param {string} alphabetValues - The alphabet values to use for encryption.
* @param {bool} encryptMode - True for using while encryption, false if it is for decryption.
* @param {object} alphabetMapping - The alphabet mapping to use for encryption.
* @returns {object} The alphabet mapping.
*/
function createAlphabetMapping(alphabetValues, encryptMode) {
    const alphabetMap = {};

    // Convert the alphabetValues to an array.
    const alphabetValuesArray = alphabetValues.split('');

    // Encrypt mode, create the alphabet mapping.
    if (encryptMode === true) {
        // Create the alphabet mapping.
        for (let i = 0; i < alphabetArray.length; i++) {
            alphabetMap[alphabetArray[i]] = alphabetValuesArray[i];
        }
    }
    // Decrypt mode, create the alphabet mapping in reverse.
    else {
        // Create the alphabet mapping.
        for (let i = 0; i < alphabetArray.length; i++) {
            alphabetMap[alphabetValuesArray[i]] = alphabetArray[i];
        }
    }

    return alphabetMap;
}

function copyTextToClipboardEncryptedResults() {
    encryptedResults.select();
    encryptedResults.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(encryptedResults.value);

    copyTextEncryptedResults.textContent = 'Text copied to clipboard!';
}

function copyTextToClipboardDecryptedResults() {
    decryptedResults.select();
    decryptedResults.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(decryptedResults.value);

    copyTextDecryptedResults.textContent = 'Text copied to clipboard!';
}

function typeWriterAnimation(text, index, elementId) {
    if (index < text.length) {
        document.getElementById(elementId).textContent += text.charAt(index);
        typeWriterTimeoutId = setTimeout(function () {
            typeWriterAnimation(text, index + 1, elementId);
        }, 0.48); // Delay of 48ms
    }
    else {
        // Clear the timeout ID.
        clearTimeout(typeWriterTimeoutId);
    }
}

function clearErrorMessages() {
    errorAlphaValues.textContent = '';
    errorSecretKey.textContent = '';
    errorPlaintextMessage.textContent = '';
    errorEncryptedResults.textContent = '';
    errorEncryptedMessage.textContent = '';
    errorDecryptedResults.textContent = '';

    copyTextEncryptedResults.textContent = '';
    copyTextDecryptedResults.textContent = '';
}

/*
* @description Encrypts a message using a substitution cipher and AES-256.
*/
function encryptMessage() {
    clearErrorMessages();

    // Alphabet values must have 26 characters.
    if (alphabetValues.value.length !== 26) {
        setErrorAndFocus(errorAlphaValues, '* Alphabet values must have 26 characters long.', alphabetValues);
    }
    // Must also be unique, no duplicates.
    else if (hasDuplicates(alphabetValues.value)) {
        setErrorAndFocus(errorAlphaValues, '* Alphabet values must be unique, no duplicates.', alphabetValues);
    }
    // AES-256 Secret Key must have 32 characters.
    else if (secretKey.value.length !== keyRequiredLength) {
        setErrorAndFocus(errorSecretKey, '* AES-256 Secret Key must have 32 characters.', secretKey);
    }
    // Only allow alphanumeric characters.
    else if (keyPattern.test(secretKey.value) === false) {
        setErrorAndFocus(errorSecretKey, '* AES-256 Secret Key must be alphanumeric. This include both letters (A-Z, a-z) and numbers (0-9).', secretKey);
    }
    // Validate the input form.
    else if (plainTextMessage.value === '' ) {
        setErrorAndFocus(errorPlaintextMessage, '* Please enter a message to encrypt.', plainTextMessage);
    }

    // If the form is valid, encrypt the message.
    if (isFormValid) {
        try {
            // Clear any error messages.
            errorPlaintextMessage.textContent = '';

            // Clear the results element before displaying the results.
            encryptedResults.textContent = '';

            // Encrypt the message using substitution cipher.
            const substitutionCipher = encryptSubstitutionCipher(plainTextMessage.value);

            // Encrypt the message using AES-256.
            const encrypted = CryptoJS.AES.encrypt(substitutionCipher, secretKey.value).toString();

            // Display the results using a typewriter effect animation.
            if (encrypted.length > 1) {
                typeWriterAnimation(encrypted, 0, 'encrypted-results');
            } else {
                typeWriterAnimation('Error encrypting message. Double check the alphabet values and secret key are correct. If error persists, try refreshing web browser, clear history and cache.', 0, 'error-encrypted-results');
            }
        }
        catch (error) {
            errorEncryptedResults.textContent = '* An error occurred while encrypting the message. If this persists, please let me know. Error message: ' + error;
        }
    }
}

function decryptMessage() {
    clearErrorMessages();

    // Alphabet values must have 26 characters.
    if (alphabetValues.value.length !== 26) {
        setErrorAndFocus(errorAlphaValues, '* Alphabet values must have 26 characters long.', alphabetValues);
    }
    // Must also be unique, no duplicates.
    else if (hasDuplicates(alphabetValues.value)) {
        setErrorAndFocus(errorAlphaValues, '* Alphabet values must be unique, no duplicates.', alphabetValues);
    }
    // AES-256 Secret Key must have 32 characters.
    else if (secretKey.value.length !== keyRequiredLength) {
        setErrorAndFocus(errorSecretKey, '* AES-256 Secret Key must have 32 characters.', secretKey);
    }
    // Only allow alphanumeric characters.
    else if (keyPattern.test(secretKey.value) === false) {
        setErrorAndFocus(errorSecretKey, '* AES-256 Secret Key must be alphanumeric. This include both letters (A-Z, a-z) and numbers (0-9).', secretKey);
    }
    // Validate the input form.
    else if (encryptedMessage.value === '' ) {
        setErrorAndFocus(errorEncryptedMessage, '* Please enter a message to decrypt.', encryptedMessage);
    }

    // If the form is valid, encrypt the message.
    if (isFormValid) {
        try {
            // Clear any error messages.
            errorEncryptedMessage.textContent = '';
            // Clear the message element before displaying the results.
            decryptedResults.textContent = '';

            // Decrypt the message using AES-256.
            const encryption = encryptedMessage.value;
            const bytes = CryptoJS.AES.decrypt(encryption.trim(), secretKey.value);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);

            // Decrypt the message using substitution cipher.
            const decryptedSubstitutionCipher = decryptSubstitutionCipher(decrypted);

            if (decryptedSubstitutionCipher.length > 1) {
                // Display the results using a typewriter effect animation.
                typeWriterAnimation(decryptedSubstitutionCipher, 0, 'decrypted-results');
            }
            else {
                typeWriterAnimation('Error decrypting message. Double check the alphabet values and secret key are correct. If error persists, try refreshing web browser, clear history and cache.', 0, 'error-decrypted-results');
            }
        }
        catch (error) {
            errorDecryptedResults.textContent = '* An error occurred while decrypting the message. If this persists, please let me know. Error message: ' + error;
        }
    }
}