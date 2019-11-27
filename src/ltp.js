
/**
 * @module Main
 */
const cleaner = require("./cleaner");
const translator = require("./translator");
const parser = require("./parser");
const LtpError = require("./errors/ltp_error");
/**
 * Main entry point of the library.
 * Converts a LaTeX expression into the syntax that the Photomath solver understands.
 * Throws a user-friendly error message in case the LaTeX expression is invalid.
 *
 * @param {String} inputText Latex expression.
 * @returns {String} Photomath solver syntax representation of inputText, or error message.
 * @throws {LtpError} User-friendly error message in err.message. Identify by err.name = "LtpError".
 */
function ltp(inputText) {
    let cleaned; let parsed; let
        translated;
    try {
        cleaned = cleaner.clean(inputText);
        parsed = parser.parse(cleaned);
        translated = translator.translate(parsed);
        return translated;
    } catch (err) {
        throw new LtpError(err);
    }
}

module.exports = ltp;
