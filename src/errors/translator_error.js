/**@module Errors */
/**
 * @class
 */
class TranslatorError extends Error {
    constructor(problem) {
        super(`Unknown entity encountered.`);
        this.name = "TranslatorError";
        this.problem = problem;
    }
}

module.exports = TranslatorError;