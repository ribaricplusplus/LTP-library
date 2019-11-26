class CleanerError extends Error {
    constructor(expression, pos, msg) {
        super(msg);
        this.name = "CleanerError";
        this.CONTEXT_LENGTH = 10; //Amount of context characters to print if error occurrs
        if (expression) {
            let printStartPos = (pos + this.CONTEXT_LENGTH) > expression.length ? expression.length : pos + this.CONTEXT_LENGTH;
            let context = expression.substr(pos, printStartPos);
            this.message = msg + ":" + context;
        }
    }
}

module.exports = CleanerError;