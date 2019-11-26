"use strict";
let bracketed = require("./bracketed.js");
class CleanerError extends Error {
    constructor(expression, pos, msg) {
        super(msg);
        this.name = "CleanerError";
        this.CONTEXT_LENGTH = 10; //Amount of characters to print if error occurrs
        if (expression) {
            let printStartPos = (pos + this.CONTEXT_LENGTH) > expression.length ? expression.length : pos + this.CONTEXT_LENGTH;
            let context = expression.substr(pos, printStartPos);
            this.message = msg + ":" + context;;
        }
    }
}

/**
 * Removes all semantically trivial LaTeX tokens, e.g. textcolor.
 * 
 * Cleaning might need to be done recursively (e.g. text within textcolor).
 * The {@link bracketed#clean} method is the main cleaner method, which takes
 * care of such recursion. It is the function into which the LaTeX expression should be
 * passed for cleaning.
 * 
 * Tokens that will be cleaned are defined in {@link bracketed#doCleaning}.
 */
let cleaner = {

    clean(expression) {
        let startExp = expression;
        expression = this.doCleaning(expression);
        while (startExp != expression) {
            startExp = expression;
            expression = this.doCleaning(expression);
        }
        return expression;
    },


    doCleaning(expression) {
        expression = this.cleanTextColor(expression);
        expression = this.convertOperators(expression);
        expression = this.cleanLeftRight(expression);
        expression = this.cleanText(expression);
        expression = this.cleanThingies(expression);
        return expression;
    },

    cleanTextColor(expression) {
        return this.cleanArgumented(expression, "\\textcolor", 2, 2);
    },

    cleanText(expression) {
        return this.cleanArgumentedRemove(expression, "\\text", 1);
    },

    cleanLeftRight(expression) {
        let matchPattern = /(\\left)|(\\right)/gi;
        return expression.replace(matchPattern, "");
    },

    cleanThingies(expression) {
        let matchPattern = /\[\d+?pt\]/gi
        expression = expression.replace(matchPattern, "");
        matchPattern = "&";
        expression = expression.replace(matchPattern, " ");
        

        return expression;
    },

    /**
     * Converts LaTeX operators into regular operators, e.g. \leq becomes <=.
     */
    convertOperators(expression) {
        var matchPattern;
        /* Multiplication */
        matchPattern = /(\\cdot)|(\\times)/gi;
        expression = expression.replace(matchPattern, "*");
        /* Division */
        matchPattern = "\\div";
        expression = expression.replace(matchPattern, "/");
        /* Comparison */
        matchPattern = /(\\leq)|(\\lt)|(\\geq)|(\\gt)/gi
        expression = expression.replace(matchPattern, (match) => {
            switch (match){
                case "\\leq":
                    return "<=";
                case "\\lt":
                    return "<";
                case "\\geq":
                    return ">=";
                case "\\gt":
                    return ">";
            }
        });
        return expression;
    },

    /*  Removes [start, end) from expression, inserts the replacement at the removed part.
        Return properties:
            - expression - the new, modified expression
            - replacementEndPos - index where replacement ends*/
    indexedReplacement(expression, start, end, replacement) {
        let expStart = expression.slice(0, start);
        let expEnd = expression.slice(end, expression.length);
        let halfNewExp = expStart + replacement;
        let newEnd = halfNewExp.length - 1;
        let newExp = halfNewExp + expEnd;
        return {
            expression: newExp,
            replacementEndPos: newEnd
        };
    },

    /*  Cleans a function of the form \name{}{}{}{}... by replacing it with one of its arguments
        Parameters:
        - name - name of the function (must include \ if the function has it)
        - x - the parameter whose value to take (1 indexed)
        - n - the total number of parameters that the latex function takes
    */
    cleanArgumented(expression, name, x, n) {
        let matchPattern = name;
        let startPos = expression.indexOf(matchPattern, 0);
        while (startPos != -1) {
            let baseEndPos = startPos + (matchPattern.length - 1) //End of match pattern position (inclusive)
            let argStartPos = 0;
            //Ignore the first x-1 arguments (their end position is at baseEndPos)
            for (let i = 0; i < x - 1; ++i) {
                argStartPos = expression.indexOf("{", baseEndPos);
                if (argStartPos == -1) {
                    throw new CleanerError(expression, startPos, "Missing arguments");
                }
                baseEndPos = bracketed.findEnd(expression, argStartPos);
            }
            //Get the value of the xth argument
            argStartPos = expression.indexOf("{", baseEndPos);
            if (argStartPos == -1) {
                throw new CleanerError(expression, startPos, "Missing arguments");
            }
            let newValue = bracketed.get(expression, argStartPos);
            baseEndPos = bracketed.findEnd(expression, argStartPos);

            //Find the end of the function
            for (let i = x; i < n; ++i) {
                argStartPos = expression.indexOf("{", baseEndPos);
                if (argStartPos == -1) {
                    throw new CleanerError(expression, startPos, "Missing arguments");
                }
                baseEndPos = bracketed.findEnd(expression, argStartPos);
            }
            //Make the replacement
            let replacementObj = this.indexedReplacement(expression, startPos, baseEndPos + 1, newValue);
            expression = replacementObj.expression;
            startPos = expression.indexOf(matchPattern, replacementObj.replacementEndPos);
        }
        return expression;
    },

    /* Works similar to cleanArgumented, except that it entirely removes a function
    instead of replacing it with one of its arguments. */
    cleanArgumentedRemove(expression, name, n) {
        let matchPattern = name;
        let startPos = expression.indexOf(matchPattern, 0);
        while (startPos != -1) {
            let baseEndPos = startPos + (matchPattern.length - 1);
            for (let i = 0; i < n; ++i) {
                let argStartPos = expression.indexOf("{", baseEndPos);
                if (argStartPos == -1) {
                    throw new CleanerError(expression, startPos, "Missing arguments");
                }
                baseEndPos = bracketed.findEnd(expression, argStartPos);
                let replacementObj = this.indexedReplacement(expression, startPos, baseEndPos + 1, "");
                expression = replacementObj.expression;
                startPos = expression.indexOf(matchPattern, replacementObj.replacementEndPos);
            }
        }
        return expression;
    }

}

module.exports = cleaner;