/**
 * Interactive password generator in Node.js
 *
 * This script allows the user to generate a secure password interactively,
 * choosing the length and types of characters to include (uppercase, lowercase, numbers, and symbols).
 * Uses the 'crypto' library to ensure password randomness.
 *
 * Usage:
 *     Run the script with Node.js and answer the questions in the console.
 */

import crypto from "crypto"; // Secure random number generation
import readline from "readline"; // Console input/output
import fs from "fs"; // File manipulation
import * as encrypter from "./encrypt.js";
import { exit } from "process";

console.clear(); // Clear the console at start

// Configure the console reading interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Generates a random password based on the given length and character set.
 *
 * @param {number} longitud - Desired password length.
 * @param {string} caracteres - String with all possible characters to use.
 * @returns {string} Generated password.
 */
function generarPassword(longitud, caracteres) {
    let password = "";
    for (let i = 0; i < longitud; i++) {
        const index = crypto.randomInt(0, caracteres.length); // Secure random index
        password += caracteres[index];
    }
    return password;
}

/**
 * Asks a question to the user and returns the answer as a promise.
 *
 * @param {string} texto - The question to display.
 * @returns {Promise<string>} User's answer.
 */
function pregunta(texto) {
    return new Promise(resolve => {
        rl.question(texto, (respuesta) => resolve(respuesta.trim()));
    });
}

// Message dictionary for internationalization
const mensajes = {
    es: {
        titulo: "🔐 Generador de contraseñas interactivo\n",
        longitud: "¿Cuántos caracteres quieres? (default 12): ",
        mayus: "¿Incluir mayúsculas? (s/n): ",
        minus: "¿Incluir minúsculas? (s/n): ",
        nums: "¿Incluir números? (s/n): ",
        simbolos: "¿Incluir símbolos? (s/n): ",
        errorTipo: "❌ Debes elegir al menos un tipo de carácter.",
        exportar: "\n¿Desea exportar la contraseña a un archivo JSON (s/n)? »» ",
        generada: "\n✅ Contraseña generada:",
        guardada: "Contraseña guardada en password.json\n",
        seleccion: "Selecciona una opción:\n1. Generar nueva contraseña\n2. Ver contraseñas guardadas\n3. Borrar archivo de contraseñas\n4. Exportar contraseñas a CSV\n5. Salir\nOpción »» "
    },
    en: {
        titulo: "🔐 Interactive password generator\n",
        longitud: "How many characters? (default 12): ",
        mayus: "Include uppercase letters? (y/n): ",
        minus: "Include lowercase letters? (y/n): ",
        nums: "Include numbers? (y/n): ",
        simbolos: "Include symbols? (y/n): ",
        errorTipo: "❌ You must choose at least one character type.",
        exportar: "\nExport password to JSON file? (y/n): ",
        generada: "\n✅ Password generated:",
        guardada: "Password saved to password.json\n",
        seleccion: "Select an option:\n1. Generate new password\n2. View saved passwords\n3. Erase passwords's file\n4. Export passwords to CSV\n5. Exit\nOption »»  "
    }
};

// Language selection
let idioma = "en"; // Default Spanish

/**
 * Prompts the user to select a language.
 * Sets the global 'idioma' variable.
 * @returns {Promise<void>}
 */
async function seleccionarIdioma() {
    const lang = await pregunta("Idioma/Language (es/en) [Default: en]: ");
    if (lang.toLowerCase() === "en") idioma = "en";
    else if (lang.toLocaleLowerCase() === "es") idioma = "es";
}

/**
 * Displays the list of saved (encrypted) passwords from the JSON file.
 * If the file does not exist or is empty, shows a message to the user.
 * Handles errors gracefully and closes the readline interface at the end.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when passwords have been displayed or an error/message has been shown.
 */
async function viewSavedPasswords() {
    console.clear();
    const filePath = "build/password.json";
    // Check if the password file exists
    if (!fs.existsSync(filePath)) {
        console.log(idioma === "es" ? "No hay contraseñas guardadas aún.\n" : "No saved passwords yet.\n");
        await sleep(4000);
        return;
    }

    try {
        // Read and parse the JSON file
        const data = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(data);
        // Check if there are any saved passwords
        if (!parsed.passwords || parsed.passwords.length === 0) {
            console.log(idioma === "es" ? "No hay contraseñas guardadas aún.\n" : "No saved passwords yet.\n");
        } else {
            // Display the list of encrypted passwords
            console.log(idioma === "es" ? "\n🔒 Contraseñas guardadas (encriptadas):" : "\n🔒 Saved passwords (encrypted):");
            parsed.passwords.forEach((pw, idx) => {
                let decryptedPassword = encrypter.decrypt(pw);
                console.log(`${idx + 1}. ${decryptedPassword}`);
            });
            console.log();
        }
    } catch (err) {
        // Handle JSON parsing or file reading errors
        console.error(idioma === "es" ? "Error al leer el archivo de contraseñas." : "Error reading password file.", err);
    }
    await sleep(4000);
}

/**
 * Interactively generates a password based on user input for length and character types.
 * Prompts the user for password length, character types to include (uppercase, lowercase, numbers, symbols),
 * and whether to export the generated password. Displays the generated password and optionally exports it.
 * Handles input validation and ensures at least one character type is selected.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when the password has been generated and displayed/exported.
 */
async function runPasswordGenerator() {
    console.clear();
    console.log(mensajes[idioma].titulo);

    // Ask for password length
    let lengthStr = await pregunta(mensajes[idioma].longitud);
    let length = parseInt(lengthStr);
    if (isNaN(length) || length < 1) length = 12;

    // Ask which character types to include
    const mayus = await pregunta(mensajes[idioma].mayus);
    const minus = await pregunta(mensajes[idioma].minus);
    const nums = await pregunta(mensajes[idioma].nums);
    const simbolos = await pregunta(mensajes[idioma].simbolos);

    // Build the character set based on answers
    let caracteres = "";
    if (mayus.toLowerCase() === (idioma === "es" ? "s" : "y")) caracteres += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (minus.toLowerCase() === (idioma === "es" ? "s" : "y")) caracteres += "abcdefghijklmnopqrstuvwxyz";
    if (nums.toLowerCase() === (idioma === "es" ? "s" : "y")) caracteres += "0123456789";
    if (simbolos.toLowerCase() === (idioma === "es" ? "s" : "y")) caracteres += "!@#$%^&*()_+-=[]{};:,.<>?";

    // Ensure at least one character type is selected
    if (!caracteres) {
        console.log(mensajes[idioma].errorTipo);
        await sleep(4000);
        return;
    }

    // Generate and display the password
    const password = generarPassword(length, caracteres);

    const exportPassword = await pregunta(mensajes[idioma].exportar);

    if (exportPassword.toLowerCase() === (idioma === "es" ? "s" : "y")) jsonExport(password);

    console.log(mensajes[idioma].generada);
    console.log(password);
    console.log();
    await sleep(4000);
}

/**
 * Exports all saved passwords to a CSV file (build/passwords.csv).
 * Each line contains the decrypted password.
 */
async function exportPasswordsToCSV() {
    const filePath = "build/password.json";
    const csvPath = "build/passwords.csv";
    if (!fs.existsSync(filePath)) {
        console.log(idioma === "es" ? "No hay contraseñas guardadas para exportar." : "No saved passwords to export.");
        await sleep(2000);
        return;
    }
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(data);
        if (!parsed.passwords || parsed.passwords.length === 0) {
            console.log(idioma === "es" ? "No hay contraseñas guardadas para exportar." : "No saved passwords to export.");
            await sleep(2000);
            return;
        }
        // Prepare CSV content
        let csvContent = "password\n";
        parsed.passwords.forEach((pw) => {
            let decrypted = encrypter.decrypt(pw);
            csvContent += `${decrypted}\n`;
        });
        fs.writeFileSync(csvPath, csvContent);
        console.log(idioma === "es" ? "Contraseñas exportadas a build/passwords.csv" : "Passwords exported to build/passwords.csv");
        await sleep(2000);
    } catch (err) {
        console.error(idioma === "es" ? "Error al exportar a CSV." : "Error exporting to CSV.", err);
        await sleep(2000);
    }
}

/**
 * Main function (menu placeholder).
 * @returns {Promise<void>}
 */
async function main() {
    await seleccionarIdioma();
    let exitMenu = false;
    while (!exitMenu) {
        console.clear();
        const question = await pregunta(mensajes[idioma].seleccion);
        if (question === "1") await runPasswordGenerator();
        else if (question === "2") await viewSavedPasswords();
        else if (question === "3") {
            fs.unlink("build/password.json", (err) => {
                if (err) {
                    console.log(idioma === "es" ? "No se pudo borrar el archivo o no existe." : "Could not delete the file or it does not exist.");
                } else {
                    console.log(idioma === "es" ? "Archivo de contraseñas borrado correctamente." : "Password file deleted successfully.");
                }
            });
            fs.unlink("build/passwords.csv", (err) => {
                if (err) {
                    console.log(idioma === "es" ? "No se pudo borrar el archivo de contraseñas CSV o no existe." : "Could not delete the file or it does not exist.");
                } else {
                    console.log(idioma === "es" ? "Archivo de contraseñas CSV borrado correctamente." : "Password file deleted successfully.");
                }
            });
            await sleep(2000);
        }
        else if (question === "4") {
            await exportPasswordsToCSV();
        }
        else if (question === "5") {
            exitMenu = true;
            rl.close();
            exit();
        }
    }
    rl.close();
    return;
}

/**
 * Exports the generated password to a JSON file, adding it to a list of existing passwords.
 * If the file does not exist, it creates it. If it exists, adds the new password to the array.
 *
 * @param {string} password - Generated password to save.
 */
function jsonExport(password) {
    fs.readFile("build/password.json", (err, data) => {
        let existingData = { passwords: [] };

        // If error is not file not found, show it
        if (err && err.code !== 'ENOENT') {
            console.error("Error reading build/password.json:", err);
            return;
        }

        // If data exists, try to parse JSON and get the passwords array
        if (data && data.length > 0) {
            try {
                existingData = JSON.parse(data);
                if (!Array.isArray(existingData.passwords)) {
                    existingData.passwords = [];
                }
            } catch (parseError) {
                console.error("Error parsing JSON file:", parseError);
                return;
            }
        }

        // Add the new password to the array
        existingData.passwords.push(encrypter.encrypt(password));

        // Save the updated object to the JSON file
        fs.writeFile("build/password.json", JSON.stringify(existingData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Error saving password to JSON:", writeErr);
            } else {
                console.log(mensajes[idioma].guardada);
            }
        });
    });
}

/**
 * Sleeps for a given number of milliseconds.
 * @param {number} ms - Milliseconds to sleep.
 * @returns {Promise<void>} Resolves after the specified time.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the main program
main();
