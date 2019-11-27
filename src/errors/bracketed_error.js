/**
 * Error thrown when invalid brackets are processed.
 * 
 * @class
 * @memberof module:Errors
 */
class BracketedError extends Error {
    /**
     * If expression and pos are provided, the message will contain the context
     * about where the error occurred. 
     * 
     * For a generic unknown error, expression may be undefined.
     * 
     * @constructor
     * @param {String} expression Expression where the error occurred. No context in message if undefined.
     * @param {int} pos Location of the error.
     * @param {String} msg Error message.
     */
    constructor(expression, pos, msg) {
        super(msg);
        /**
         * Amount of context characters to print around the error position.
         */
        this.CONTEXT_LENGTH = 10;

        this.name = "BracketedError";
        if (expression) {
            let printStartPos = (pos + this.CONTEXT_LENGTH) > expression.length ? expression.length : pos + this.CONTEXT_LENGTH;
            let errorMsg = "Missing closing brace ";
            let context = expression.substr(pos, printStartPos);
            errorMsg = errorMsg + context;
            this.message = errorMsg;
        }
    }
}

module.exports = BracketedError;