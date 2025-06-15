# Interactive Password Generator

A simple Node.js CLI tool to generate secure passwords interactively, supporting English and Spanish.

## Features

- Choose password length and character types (uppercase, lowercase, numbers, symbols)
- Secure random generation using Node's `crypto` module
- Internationalization: English and Spanish support
- Optionally export generated passwords to a JSON file (`password.json`)

## Usage

1. Install Node.js (v14+ recommended)
2. Clone this repository
3. Run the script:

   ```bash
   node index.js
   ```

4. Follow the prompts to select language, password options, and whether to export the password.

## Exported Passwords

If you choose to export, passwords are saved in `password.json` as an array:

```json
{
  "passwords": [
    "examplePassword1",
    "examplePassword2"
  ]
}
```

## Internationalization

At the start, select your language (`es` for Spanish, `en` for English). All prompts and messages will be shown in the selected language.

## License

MIT License

---

**Author:** gromber05