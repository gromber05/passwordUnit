/**
 * Generador de contraseñas interactivo en Node.js
 * 
 * Este script permite al usuario generar una contraseña segura de manera interactiva,
 * eligiendo la longitud y los tipos de caracteres a incluir (mayúsculas, minúsculas, números y símbolos).
 * Utiliza la librería 'crypto' para asegurar la aleatoriedad de la contraseña.
 * 
 * Uso:
 *   Ejecuta el script con Node.js y responde a las preguntas en consola.
 * 
 */

const crypto = require("crypto"); // Módulo para generación segura de números aleatorios
const readline = require("readline"); // Módulo para entrada/salida por consola
const fs = require("fs"); // Módulo para manipulación de archivos
const { json } = require("stream/consumers");

console.clear(); // Limpia la consola al iniciar

// Configura la interfaz de lectura de consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Genera una contraseña aleatoria según la longitud y el conjunto de caracteres dados.
 * 
 * @param {number} longitud - Longitud deseada de la contraseña.
 * @param {string} caracteres - Cadena con todos los caracteres posibles a usar.
 * @returns {string} Contraseña generada.
 */
function generarPassword(longitud, caracteres) {
  let password = "";
  for (let i = 0; i < longitud; i++) {
    const index = crypto.randomInt(0, caracteres.length); // Selecciona un índice aleatorio seguro
    password += caracteres[index];
  }
  return password;
}

/**
 * Realiza una pregunta al usuario y devuelve la respuesta como promesa.
 * 
 * @param {string} texto - Texto de la pregunta a mostrar.
 * @returns {Promise<string>} Respuesta del usuario.
 */
function pregunta(texto) {
  return new Promise(resolve => {
    rl.question(texto, (respuesta) => resolve(respuesta.trim()));
  });
}

/**
 * Función principal que ejecuta el flujo interactivo del generador de contraseñas.
 */
async function main() {
  console.log("🔐 Generador de contraseñas interactivo\n");

  // Pregunta la longitud de la contraseña
  let lengthStr = await pregunta("¿Cuántos caracteres quieres? (default 12): ");
  let length = parseInt(lengthStr);
  if (isNaN(length) || length < 1) length = 12;

  // Pregunta qué tipos de caracteres incluir
  const mayus = await pregunta("¿Incluir mayúsculas? (s/n): ");
  const minus = await pregunta("¿Incluir minúsculas? (s/n): ");
  const nums = await pregunta("¿Incluir números? (s/n): ");
  const simbolos = await pregunta("¿Incluir símbolos? (s/n): ");

  // Construye el conjunto de caracteres según las respuestas
  let caracteres = "";
  if (mayus.toLowerCase() === "s") caracteres += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (minus.toLowerCase() === "s") caracteres += "abcdefghijklmnopqrstuvwxyz";
  if (nums.toLowerCase() === "s") caracteres += "0123456789";
  if (simbolos.toLowerCase() === "s") caracteres += "!@#$%^&*()_+-=[]{};:,.<>?";

  // Verifica que al menos un tipo de carácter haya sido seleccionado
  if (!caracteres) {
    console.log("❌ Debes elegir al menos un tipo de carácter.");
    rl.close();
    return;
  }

  // Genera y muestra la contraseña
  const password = generarPassword(length, caracteres);

  const exportPassword = await pregunta('\n¿Desea exportar la contraseña a un archivo JSON (s/n)? »» ')

  if(exportPassword.toLowerCase() === "s") jsonExport(password);

  console.log("\n✅ Contraseña generada:");
  console.log(password);
  console.log();

  rl.close();
}

/**
 * Exporta la contraseña generada a un archivo JSON, agregándola a una lista de contraseñas existentes.
 * Si el archivo no existe, lo crea. Si existe, añade la nueva contraseña al arreglo.
 * 
 * @param {string} password - Contraseña generada a guardar.
 */
function jsonExport(password) {
    fs.readFile("password.json", (err, data) => {
        let existingData = { passwords: [] };

        // Si hay error distinto a archivo no encontrado, mostrarlo
        if (err && err.code !== 'ENOENT') {
            console.error("Error al leer el archivo password.json:", err);
            return;
        }

        // Si hay datos, intentar parsear el JSON y obtener el arreglo de contraseñas
        if (data) {
            try {
                existingData = JSON.parse(data);
                if (!Array.isArray(existingData.passwords)) {
                    existingData.passwords = [];
                }
            } catch (parseError) {
                console.error("Error al parsear el archivo JSON:", parseError);
                return;
            }
        }

        // Añade la nueva contraseña al arreglo
        existingData.passwords.push(password);

        // Guarda el objeto actualizado en el archivo JSON
        fs.writeFile("password.json", JSON.stringify(existingData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Error al guardar la contraseña en JSON:", writeErr);
            } else {
                console.log("Contraseña guardada en password.json\n");
            }
        });
    });
}

// Ejecuta el programa principal
main();
