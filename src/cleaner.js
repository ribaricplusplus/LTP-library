"use strict";
let bracketed = require("./bracketed.js");

/**
 * @class
 * 
 * Removes all semantically trivial LaTeX tokens such as textcolor.
 * 
 * The [clean]{@link Cleaner#clean} method is the main Cleaner method to call with
 * the expression to clean.
 * 
 * Tokens that will be cleaned are defined by [runRegisteredCleaners]{@link Cleaner#runRegisteredCleaners}.
 * 
 */
class Cleaner {
    constructor() {
        this.expression = "";
    }
    
    /**
     * The main Cleaner method which takes a decorated LaTeX expression and
     * returns it in the form ready for parsing.
     * @param {String} expression LaTeX expression to clean.
     * @returns {String} Cleaned expression ready for parsing.
     */
    clean(expression) {
        this.expression = expression;
        return this.cleanRecursively();
    }

    cleanRecursively() {
        let startExpression = this.expression;
        this.runRegisteredCleaners();
        /* As long as cleaning changes the expression, keep cleaning. */
        while (startExpression != this.expression) {
            startExpression = this.expression;
            this.runRegisteredCleaners();
        }
        return this.expression;
    }

    /**
     * Invokes cleaner methods which define the tokens that are to be removed
     * from the LaTeX expression.
     */
    runRegisteredCleaners() {
         this.cleanTextColor();
         this.convertOperators();
         this.cleanLeftRight();
         this.cleanText();
         this.cleanThingies();
    }

    cleanTextColor() {
        this.replaceFunctionWithParameter("\\textcolor", 2, 2);
    }

    cleanText() {
        this.cleanFunctionWithParameter("\\text", 1);
    }

    cleanLeftRight() {
        let matchPattern = /(\\left)|(\\right)/gi;
        this.expression = this.expression.replace(matchPattern, "");
    }

    cleanThingies() {
        let matchPattern = /\[\d+?pt\]/gi
        this.expression = this.expression.replace(matchPattern, "");
        matchPattern = "&";
        this.expression = this.expression.replace(matchPattern, " ");
    }

    /**
     * Converts LaTeX operators into regular operators, e.g. \leq becomes <=.
     */
    convertOperators() {
        var matchPattern;
        /* Multiplication */
        matchPattern = /(\\cdot)|(\\times)/gi;
        this.expression = this.expression.replace(matchPattern, "*");
        /* Division */
        matchPattern = "\\div";
        this.expression = this.expression.replace(matchPattern, "/");
        /* Comparison */
        matchPattern = /(\\leq)|(\\lt)|(\\geq)|(\\gt)/gi
        this.expression = this.expression.replace(matchPattern, (match) => {
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
    }

    /**
     * Removes [start, end) from expression, inserts the replacement in place of the removed part.
     * 
     * @param {String} expression Input expression.
     * @param {int} start Start index of the substring to remove.
     * @param {int} end End index of the substring to remove, noninclusive.
     * @param {String} replacement String to insert at start position.
     * @returns {Object} Object with properties: <ul>
     * <li><strong>expression</strong> - new expression</li>
     * <li><strong>replacementEndPos</strong> - index where the replacement ends, inclusive</li></ul>
     * 
     *
     */
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
    }
   /**
    * Replaces a function of the form name{}{}{} with one of its parameters.
    * 
    * @param {String} name Name of the function to replace. Must include \ explicitly.
    * @param {int} x The parameter with which to replace the function. First parameter is 1.
    * @param {int} n Total number of parameters that the function takes.
    */
    replaceFunctionWithParameter(name, x, n) {
        let matchPattern = name;
        let startPos = this.expression.indexOf(matchPattern, 0);
        while (startPos != -1) {
            let baseEndPos = startPos + (matchPattern.length - 1) //End of match pattern position (inclusive)
            let argStartPos = 0;
            //Ignore the first x-1 arguments (their end position is at baseEndPos)
            for (let i = 0; i < x - 1; ++i) {
                argStartPos = this.expression.indexOf("{", baseEndPos);
                if (argStartPos == -1) {
                    throw new CleanerError(this.expression, startPos, "Missing arguments");
                }
                baseEndPos = bracketed.findEnd(this.expression, argStartPos);
            }
            //Get the value of the xth argument
            argStartPos = this.expression.indexOf("{", baseEndPos);
            if (argStartPos == -1) {
                throw new CleanerError(this.expression, startPos, "Missing arguments");
            }
            let newValue = bracketed.get(this.expression, argStartPos);
            baseEndPos = bracketed.findEnd(this.expression, argStartPos);

            //Find the end of the function
            for (let i = x; i < n; ++i) {
                argStartPos = this.expression.indexOf("{", baseEndPos);
                if (argStartPos == -1) {
                    throw new CleanerError(this.expression, startPos, "Missing arguments");
                }
                baseEndPos = bracketed.findEnd(this.expression, argStartPos);
            }
            //Make the replacement
            let replacementObj = this.indexedReplacement(this.expression, startPos, baseEndPos + 1, newValue);
            this.expression = replacementObj.expression;
            startPos = this.expression.indexOf(matchPattern, replacementObj.replacementEndPos);
        }
    }

    /**
     * Removes a function of the form name{}{}{}. 
     * 
     * @param {String} name Name of the function to replace. Must include \ explicitly.
     * @param {int} n Total number of parameters that the function takes.
     */
    cleanFunctionWithParameter(name, n) {
        let matchPattern = name;
        let startPos = this.expression.indexOf(matchPattern, 0);
        while (startPos != -1) {
            let baseEndPos = startPos + (matchPattern.length - 1);
            for (let i = 0; i < n; ++i) {
                let argStartPos = this.expression.indexOf("{", baseEndPos);
                if (argStartPos == -1) {
                    throw new CleanerError(this.expression, startPos, "Missing arguments");
                }
                baseEndPos = bracketed.findEnd(this.expression, argStartPos);
                let replacementObj = this.indexedReplacement(this.expression, startPos, baseEndPos + 1, "");
                this.expression = replacementObj.expression;
                startPos = this.expression.indexOf(matchPattern, replacementObj.replacementEndPos);
            }
        }
    }

}

module.exports = new Cleaner();