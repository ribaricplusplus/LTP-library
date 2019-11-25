"use strict";
export function translate(inputText) {
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