"use strict";
let bracketed = require("./bracketed.js");
class TranslatorError extends Error {
    constructor(problem) {
        super(`Unknown entity encountered.`);
        console.log("Object that caused translator error:")
        console.log(problem);
        this.name = "TranslatorError";
        this.problem = problem;
    }
}
let translator = {
    /*
    Parameter: LatexNode - any recognized latex unit.

    If the node is an expression, translate all its arguments.
    If the node is something else, call the corresponding translator function.
    */
    translate(node) {
        var result;
        switch (node.type) {
            case "root":
                result = this.translateRoot(node);
                break;
            case "environment":
                result = this.translateEnvironment(node);
                break;
            case "expression":
                result = this.translateExpression(node);
                break;
            case "function":
                result = this.translateFunction(node);
                break;
            case "calcunit":
                result = this.translateCalcunit(node);
                break;
            case "char":
                result = this.translateChar(node);
                break;
            default: //Unknown type
                throw new TranslatorError(node);
        }
        return result;
    },

    translateRoot(rootObj) {
        var result = "";
        for (let exp of rootObj.arg) {
            result += this.translateExpression(exp);
        }
    },

    /* Parameter: LatexExpression */
    translateExpression(expressionObj) {
        var result;
        var openingBrace;
        var closingBrace;
        switch (expressionObj.bracketType) {
            case "curly":
                openingBrace = "{";
                closingBrace = "}";
                break;
            case "round":
                openingBrace = "(";
                closingBrace = ")";
                break;
            case "square":
                openingBrace = "[";
                closingBrace = "]";
                break;
            default:
                openingBrace = "";
                closingBrace = "";
        }
        result = openingBrace;
        for (let arg of expressionObj.arg) {
            switch (arg.type) {
                case "root":
                    result = result + this.translateRoot(arg);
                    break;
                case "environment":
                    result = result + this.translateEnvironment(arg);
                    break;
                case "expression":
                    result = result + this.translateExpression(arg);
                    break;
                case "function":
                    result = result + this.translateFunction(arg);
                    break;
                case "calcunit":
                    result = result + this.translateCalcunit(arg);
                    break;
                case "char":
                    result = result + arg.arg;
                    break;
                default: //Unknown type
                    throw new TranslatorError(arg);
            }
        }
        result = result + closingBrace;
        return result;
    },

    /* Parameter: LatexCharacter */
    translateChar(charObj) {
        return charObj.arg;
    },

    /* 
    Parameter: LatexFunction */
    translateFunction(funcObj) {
        let name = funcObj.name;
        let translatingFunction = this.funcTranslations[name];
        /* Translate arguments */
        for (let i = 0; i < funcObj.arg.length; ++i) {
            funcObj.arg[i] = translator.translate(funcObj.arg[i]);
            if (funcObj.arg[i][0] == "{" || funcObj.arg[i][0] == "[") {
                funcObj.arg[i] = bracketed.get(funcObj.arg[i]);
            }
        }
        /* Translate (and take care of exponentiated form if present) */
        if (funcObj.exponent) {
            return "{" + translatingFunction(funcObj) + "}^" + this.translate(funcObj.exponent);
        }
        else {
            return translatingFunction(funcObj);
        }
    },

    /*  Parameter: LatexCalcunit.
        It is assumed that calcunit arguments can be only LatexCharacter type. */
    translateCalcunit(calcunitObj) {
        var result = "";
        for(let arg of calcunitObj.arg)
        {
            result+=this.translateChar(arg);
        }
        return result;
    },

    /* Parameter: LatexNode */
    translateRoot(rootObj) {
        var result = "";
        for (let exp of rootObj.arg) {
            result += this.translateExpression(exp);
        }
        return result;
    },

    /* Defines how each specific LaTeX function is translated*/
    funcTranslations: {
        regular: (funcObj) => {
            return `${funcObj.arg[0]}(${funcObj.arg[1]})`;
        },
        abs: (funcObj) => {
            return `abs(${funcObj.arg[0]})`;
        },
        sqrt: (funcObj) => {
            if (funcObj.arg.length == 2) {
                return `root(${funcObj.arg[0]}, ${funcObj.arg[1]})`;
            }
            else {
                return `root2(${funcObj.arg[0]})`;
            }
        },
        integral: (funcObj) => {
            if (funcObj.arg.length == 2) {
                return `integral(${funcObj.arg[0]}, ${funcObj.arg[1]})`;
            }
            else {
                return `definiteintegral(${funcObj.arg[0]}, ${funcObj.arg[1]}, ${funcObj.arg[2]}, ${funcObj.arg[3]})`;
            }
        },
        fraction: (funcObj) => {
            return `{{${funcObj.arg[0]}}/{${funcObj.arg[1]}}}`;
        },

        derivative: (funcObj) => {
            return `derivation(${funcObj.arg[1]}, ${funcObj.arg[2]})`;
        },

        latex_function: (funcObj) => {
            funcObj.arg[1] = bracketed.get(funcObj.arg[1]);
            return `function(${funcObj.arg[0]}, ${funcObj.arg[1]})=${funcObj.arg[2]}`;
        },

        latex_function_inverse: (funcObj) => {
            funcObj.arg[1] = bracketed.get(funcObj.arg[1]);
            return `function_inverse(${funcObj.arg[0]}, ${funcObj.arg[1]})=${funcObj.arg[2]}`;
        },

        binomial: (funcObj) => {
            return `choose(${funcObj.arg[0]}, ${funcObj.arg[1]})`;
        },

        logarithm: (funcObj) => {
            return `log(${funcObj.arg[0]}, ${funcObj.arg[1]})`;
        },

        logarithm_10: (funcObj) => {
            return `log10(${funcObj.arg[0]})`;
        },

        logarithm_ln: (funcObj) => {
            return `ln(${funcObj.arg[0]})`;
        },

        limit: (funcObj) => {
            return `lim(${funcObj.arg[0]}, ${funcObj.arg[1]}, ${funcObj.arg[2]})`;
        },

        mean: (funcObj) => {
            return `mean(${funcObj.arg[0]})`;
        },

        degrees: (funcObj) => {
            return `deg(${funcObj.arg[0]})`;
        }
    },
    /* ENVIRONMENTS */

    /* Paramter: LatexEnvironment */
    translateEnvironment(envObj) {
        var result;
        switch (envObj.envType) {
            case "system":
                result = this.translateEnvironmentSystem(envObj);
                break;
            case "determinant":
                result = this.translateEnvironmentDeterminant(envObj);
            default: //Unknown environment type
                throw new TranslatorError(envObj);
        }
        return result;
    },

    /* Paramter: LatexEnvironment with envType = "system" */
    translateEnvironmentSystem(systemEnvObj) {
        let translatedArgs = [];
        for (let arg of systemEnvObj.arg) {
            translatedArgs.push(this.translate(arg));
        }
        return "system(" + translatedArgs.join(',') + ")";
    },

};

module.exports = translator;