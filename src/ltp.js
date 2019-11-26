"use strict";
/**
 * @module Main
 */

 /**
  * Converts a LaTeX expression into the syntax that the Photomath solver understands.
  * Throws a user-friendly error in case the LaTeX expression is invalid.
  * 
  * @param {String} inputText Latex expression.
  */
function ltp(inputText) {
    let cleaner = require("./cleaner");
    let translator = require("./translator");
    let parser = require("./parser");
    var cleaned, parsed, translated;
    try {
        cleaned = cleaner.clean(inputText);
        parsed = parser.parse(cleaned);
        translated = translator.translate(parsed);
        return translated;
    } catch (err) {
        console.log(err);
    }
}

module.exports = ltp;