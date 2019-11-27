/**
 * When parsed, LaTeX expressions get converted into types that are defined here.
 * This greatly eases how LaTeX expressions can be handled programmatically.<br>
 * <br>
 * As an example, suppose that a fraction written in LaTeX need be evaluated.
 * By modeling the fraction as a [LatexFunction]{@link module:Types.LatexFunction}
 * object, its value can be calculated as frac.arg[0] / frac.arg[1].
 * @module Types
 */

/**
 *
 * Generic LaTeX node.
 *
 * Every other node in the parse tree must also be a LatexNode. Thus, each node
 * has a defined type and arguments.
 * @class
 */
class LatexNode {
    /**
     * @constructor
     * @param {String} type Type of the node (function, environment, or calcunit).
     * @param {Array<LatexNode>} arg Contents of the node.
     */
    constructor(type, arg) {
        this.arg = arg;
        this.type = type;
    }
}

/**
 * Models all LaTeX functions: anything of the form \name{}{}{} (arbitrary number of parameters).
 * @class
 */
class LatexFunction extends LatexNode {
    /**
     * Rule for naming functions in the grammar:
     * [Translator]{@link module:Main.Translator} relies on the function name to apply the
     * correct translation. Therefore, the name assigned in the grammar and the name
     * used in [funcTranslations]{@link module:Main.Translator#funcTranslations} must correspond.
     * @param {String} name Name of the function. (e.g., the name for \sin is sin).
     * @param {Array<LatexNode>} arg Contents of the function.
     * @param {LatexNode} [exponent] The exponent in the syntax \name^{exponent}{}{}.
     */
    constructor(name, arg, exponent) {
        super("function", arg);
        this.name = name;
        this.exponent = exponent;
    }
}

/**
 *
 * Node whose contents require no manipulation before being passed to the solver, e.g. 2x+3.
 * @class
 */
class LatexCalcunit extends LatexNode {
    /**
     * @constructor
     * @param {Array<LatexNode>} arg Contents of the Calcunit.
     */
    constructor(arg) {
        super("calcunit", arg);
    }
}

/**
 *
 * General expression which consists of several functions, calcunits or environments.
 * @class
 */
class LatexExpression extends LatexNode {
    constructor(arg, bracketType) {
        super("expression", arg);
        this.bracketType = bracketType;
    }
}

/** Literal character.
 * @class
 */
class LatexCharacter extends LatexNode {
    /**
     * @param {String} arg Literal character.
     */
    constructor(arg) {
        super("char", arg);
    }
}

/**
 * LaTeX environment is anything that looks like \begin{smth} \end{smth}.
 * This includes systems of equations and matrices.
 * @class
 */
class LatexEnvironment extends LatexNode {
    /**
     *
     * @param {String} envType Environment type (system of equations, determinant...).
     * @param {Array<LatexExpression>} arg Expressions contained within the environment.
     */
    constructor(envType, arg) {
        super("environment", arg);
        this.envType = envType;
    }
}

module.exports = {
    LatexNode,
    LatexFunction,
    LatexExpression,
    LatexCalcunit,
    LatexCharacter,
    LatexEnvironment,
};
