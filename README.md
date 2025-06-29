# Interactive Password Generator

A simple Node.js CLI tool to generate secure passwords interactively, supporting English and Spanish.

## Features

- Choose password length and character types (uppercase, lowercase, numbers, symbols)
- Secure random generation using Node's `crypto` module
- Internationalization: English and Spanish support
- Optionally export generated passwords to a JSON file (`password.json`)
- **Passwords are saved encrypted for security**

## Usage

1. Install Node.js (v14+ recommended)
2. Clone this repository

    ```bash
    git clone https://github.com/gromber05/passwordUnit.git
    ```

3. Run the script:

   ```bash
   node src/index.js
   ```

4. Follow the prompts to select language, password options, and whether to export the password.

## Exported Passwords

If you choose to export, passwords are saved encrypted in `build/password.json` as an array:

```json
{
  "passwords": [
    "<encryptedPassword1>",
    "<encryptedPassword2>"
  ]
}
```

## Internationalization

At the start, select your language (`es` for Spanish, `en` for English). All prompts and messages will be shown in the selected language.

## License

MIT License

---

**Author:** gromber05
