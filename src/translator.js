const bracketed = require("./bracketed.js");
const TranslatorError = require("./errors/translator_error");
/**
 * Class with methods that convert parsed LaTeX into the solver syntax.
 *
 * [translate]{@link Translator#translate} is the main method.
 *
 * @class
 * @memberof module:Main
 */
class Translator {
    constructor() {
        /**
         * Methods that define the translation of specific LaTeX functions.
         */
        this.funcTranslations = {
            regular: (funcObj) => `${funcObj.arg[0]}(${funcObj.arg[1]})`,
            abs: (funcObj) => `abs(${funcObj.arg[0]})`,
            sqrt: (funcObj) => {
                if (funcObj.arg.length == 2) {
                    return `root(${funcObj.arg[0]}, ${funcObj.arg[1]})`;
                }

                    return `root2(${funcObj.arg[0]})`;
            },
            integral: (funcObj) => {
                if (funcObj.arg.length == 2) {
                    return `integral(${funcObj.arg[0]}, ${funcObj.arg[1]})`;
                }

                    return `definiteintegral(${funcObj.arg[0]}, ${funcObj.arg[1]}, ${funcObj.arg[2]}, ${funcObj.arg[3]})`;
            },
            fraction: (funcObj) => `{{${funcObj.arg[0]}}/{${funcObj.arg[1]}}}`,

            derivative: (funcObj) => `derivation(${funcObj.arg[1]}, ${funcObj.arg[2]})`,

            latex_function: (funcObj) => {
                funcObj.arg[1] = bracketed.get(funcObj.arg[1]);
                return `function(${funcObj.arg[0]}, ${funcObj.arg[1]})=${funcObj.arg[2]}`;
            },

            latex_function_inverse: (funcObj) => {
                funcObj.arg[1] = bracketed.get(funcObj.arg[1]);
                return `function_inverse(${funcObj.arg[0]}, ${funcObj.arg[1]})=${funcObj.arg[2]}`;
            },

            binomial: (funcObj) => `choose(${funcObj.arg[0]}, ${funcObj.arg[1]})`,

            logarithm: (funcObj) => `log(${funcObj.arg[0]}, ${funcObj.arg[1]})`,

            logarithm_10: (funcObj) => `log10(${funcObj.arg[0]})`,

            logarithm_ln: (funcObj) => `ln(${funcObj.arg[0]})`,

            limit: (funcObj) => `lim(${funcObj.arg[0]}, ${funcObj.arg[1]}, ${funcObj.arg[2]})`,

            mean: (funcObj) => `mean(${funcObj.arg[0]})`,

            degrees: (funcObj) => `deg(${funcObj.arg[0]})`,
        };
    }

    /**
     * Translates given LatexNode into solver syntax by calling other helper methods
     * based on the LatexNode type.
     *
     * @param {LatexNode} node The node to translate.
     * @returns {String} Representation of the LatexNode in solver syntax.
     */
    translate(node) {
        let result;
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
            default: // Unknown type
                throw new TranslatorError(node);
        }
        return result;
    }

    /**
     * @param {LatexNode} rootObj Root object to translate.
     */
    translateRoot(rootObj) {
        let result = "";
        for (const exp of rootObj.arg) {
            result += this.translateExpression(exp);
        }
        return result;
    }

    /**
     * @param {LatexExpression} expressionObj Expression object to translate.
     */
    translateExpression(expressionObj) {
        let result;
        let openingBrace;
        let closingBrace;
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
        for (const arg of expressionObj.arg) {
            switch (arg.type) {
                case "root":
                    result += this.translateRoot(arg);
                    break;
                case "environment":
                    result += this.translateEnvironment(arg);
                    break;
                case "expression":
                    result += this.translateExpression(arg);
                    break;
                case "function":
                    result += this.translateFunction(arg);
                    break;
                case "calcunit":
                    result += this.translateCalcunit(arg);
                    break;
                case "char":
                    result += arg.arg;
                    break;
                default: // Unknown type
                    throw new TranslatorError(arg);
            }
        }
        result += closingBrace;
        return result;
    }

    /**
     * @param {LatexCharacter} charObj Character object to translate.
     */
    translateChar(charObj) {
        return charObj.arg;
    }

    /**
     * Translates latex functions, such as \fract{1}{2}.<br><br>
     * To define a new translation, create a translating method
     * in [funcTranslations]{@link Translator#funcTranslations}.
     * <strong>Important note: </strong> The name of the method must match the name of the
     * function.
     * @param {LatexFunction} funcObj Function object to translate.
     */
    translateFunction(funcObj) {
        const { name } = funcObj;
        const translatingFunction = this.funcTranslations[name];
        /* Translate arguments */
        for (let i = 0; i < funcObj.arg.length; ++i) {
            funcObj.arg[i] = this.translate(funcObj.arg[i]);
            if (funcObj.arg[i][0] == "{" || funcObj.arg[i][0] == "[") {
                funcObj.arg[i] = bracketed.get(funcObj.arg[i]);
            }
        }
        /* Translate (and take care of exponentiated form if present) */
        if (funcObj.exponent) {
            return `{${translatingFunction(funcObj)}}^${this.translate(funcObj.exponent)}`;
        }

            return translatingFunction(funcObj);
    }

    /**
     * @param {LatexCalcunit} calcunitObj Calcunit object to translate.
     */
    translateCalcunit(calcunitObj) {
        let result = "";
        for (const arg of calcunitObj.arg) {
            result += this.translateChar(arg);
        }
        return result;
    }

    /* ENVIRONMENTS */

    /**
     * Translates any environment based on its envType property.
     * @param {LatexEnvironment} envObj The environment to translate.
     */
    translateEnvironment(envObj) {
        let result;
        switch (envObj.envType) {
            case "system":
                result = this.translateEnvironmentSystem(envObj);
                break;
            case "det2":
            case "det3":
                result = this.translateEnvironmentDeterminant(envObj);
                break;
            default: // Unknown environment type
                throw new TranslatorError(envObj);
        }
        return result;
    }

    /**
     * Translates a system of equations.
     * @param {LatexEnvironment} systemEnvObj Latex environment with envType = system.
     */
    translateEnvironmentSystem(systemEnvObj) {
        const translatedArgs = [];
        for (const arg of systemEnvObj.arg) {
            translatedArgs.push(this.translate(arg));
        }
        return `system(${translatedArgs.join(',')})`;
    }

    /**
     * Translates 2x2 and 3x3 matrices into determinants.
     * @param {LatexEnvironment} detObj Matrix to find the determinant of.
     */
    translateEnvironmentDeterminant(detObj) {
        const translatedArgs = [];
        for (const arg of detObj.arg) {
            translatedArgs.push(this.translate(arg));
        }
        let len;
        switch (translatedArgs.length) {
            case 4: len = "2";
                break;
            case 9: len = "3";
                break;
            default:
                throw new TranslatorError(detObj);
        }
        return `det${len}(${translatedArgs.join(',')})`;
    }
}

module.exports = new Translator();
