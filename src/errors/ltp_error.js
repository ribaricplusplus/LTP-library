/**
 * Error designed to make user-reporting convenient by just needing to print the message. For debugging purposes,
 * check [cause]{@link module:Errors.LtpError#cause}.
 * @class
 * @memberof module:Errors
 */
class LtpError{
    /**
     * 
     * @param {Error} err Any error that was thrown within LTP library.
     */
    constructor(err, inputText){
        /** Error representing what exactly happened within LTP. */
        this.cause = err;
        if (["CleanerError", "BracketedError", "SyntaxError"].includes(err.name)) {
            if (err.name == "SyntaxError") {
                const CONTEXT_LENGTH = 10;
                const context = inputText.substring(err.location.start.offset, err.location.end.offset + CONTEXT_LENGTH + 1);
                err.message = `Unexpected token "${err.found}" at line ${err.location.start.line}, column ${err.location.start.column}, within context: ${context}`;
            }
            err.message = `Error: ${err.message}`;
        } else {
            err.message = `Error.`
        }
        this.message = err.message;
        this.name = "LtpError";
    }
}

module.exports = LtpError;