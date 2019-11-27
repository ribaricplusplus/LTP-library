
/**
 * @module Main
 */
const cleaner = require("./cleaner");
const translator = require("./translator");
const parser = require("./parser");
/**
 * Main entry point of the library.
 * Converts a LaTeX expression into the syntax that the Photomath solver understands.
 * Returns a user-friendly error message in case the LaTeX expression is invalid.
 *
 * @param {String} inputText Latex expression.
 * @returns {String} Photomath solver syntax representation of inputText, or error message.
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
        if (["CleanerError", "BracketedError", "SyntaxError"].includes(err.name)) {
            if (err.name == "SyntaxError") {
                const CONTEXT_LENGTH = 10;
                const context = inputText.substring(err.location.start.offset, err.location.end.offset + CONTEXT_LENGTH + 1);
                err.message = `Unexpected token "${err.found}" at line ${err.location.start.line}, column ${err.location.start.column}, within context: ${context}`;
            }
            err.message = `Error: ${err.message}`;
            return err.message;
        }
            return "Error.";
    }
}

module.exports = ltp;
