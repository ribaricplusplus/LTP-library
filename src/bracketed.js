let BracketedError = require("./errors/bracketed_error");
/**
 * Manipulates expressions in brackets. Throws a [BracketedError]{@link Errors:BracketedError} for missing/invalid bracket pairs.
 * @class
 * @memberof module:Main
 */
class Bracketed {
    constructor() {
        this.bracketPairs = {
            '(': ')',
            '{': '}',
            '[': ']'
        }
    }
    /**
     * Gets contents inside brackets maching given opening brace at pos.
     * For example, get("{hello}", 0) returns hello.
     * @param {String} expression Expression that contains an expression inside brackets.
     * @param {int} pos Index of the opening brace.
     * @returns {String} Expression inside brackets.
     */
    get(expression, pos) {
        if (!pos)
        {
            pos = 0;
        }
        return expression.substring(pos+1, this.findEnd(expression, pos));
    }

    /**
     * 
     * @param {String} expression Expression that contains an expression inside brackets.
     * @param {int} pos Index of the opening brace.
     * @returns {int} Index of the closing brace matching the opening brace at pos.
     * @throws {BracketedError}
     */
    findEnd(expression, pos) {
        /*  Create a stack for brackets. Each time { is found, add it to the stack.
            Whenever } is found, pop one opening bracket from the stack.
            
            When stack becomes empty, end is found, return that index.
            If end of expression and stack nonempty throw error (missing closing brace)*/
        let bracketStack = [];
        let openingBracket;
        let closingBracket;
        for (let bracket of Object.keys(this.bracketPairs)) {
            if (expression[pos] == bracket) {
                openingBracket = bracket;
                closingBracket = this.bracketPairs[bracket];
            }
        }
        if (openingBracket == undefined) {
            throw new BracketedError(undefined, undefined, "Expression not starting with a bracket was sent to bracket parser.");
        }
        bracketStack.push(openingBracket);
        let index = pos;
        while (bracketStack.length > 0) {
            ++index;
            if (index > expression.length - 1) {
                throw new BracketedError(expression, pos);
            }
            else if (expression[index] == openingBracket) {
                bracketStack.push(openingBracket);
            }
            else if (expression[index] == closingBracket) {
                bracketStack.pop();
            }
        }
        return index;
    }
}

module.exports = new Bracketed();