{
    let specialSymbols = 
    {
        "\\pi":"π",
        "\\infty":"∞",
        "\\alpha":"α",
        "\\epsilon":"ε",
        "\\beta":"β",
        "\\lambda":"λ",
        "\\gamma":"γ",
        "\\rho":"ρ",
        "\\delta":"δ",
        "\\sigma":"σ",
        "\\theta":"θ"
    }

    class LatexNode
    {
        constructor(type, arg)
        {
            this.arg = arg;
            this.type = type;
        }
    }

    /* Models all LaTeX functions: Trigonometric functions,
    integrals, derivatives, fractions, etc.

    Rule for naming functions:
    The translator relies on the function name to apply the correct translation.
    Therefore, the name assigned in the grammar and the name used in the 
    "funcTranslations" object of the translator must correspond.
    */
    class LatexFunction extends LatexNode
    {
        /*  Parameters:
                - name - name of the function
                - arg - arguments of the function
                - exponent - if defined, the function is in exponentiated form*/
        constructor(name, arg, exponent){
            super("function", arg);
            this.name = name;
            this.exponent = exponent;
        }
    }

    /* Models expressions that require no manipulation before being passed
    to the Solver, e.g. 2x+3 */
    class LatexCalcunit extends LatexNode
    {
        constructor(arg)
        {
            super("calcunit", arg);
        }
    }

    /* Models the most general LaTeX expression. arg is an array of all the
    LaTeX expression units such as functions and calcunits. */
    class LatexExpression extends LatexNode
    {
        constructor(arg, bracketType){
            super("expression", arg);
            this.bracketType = bracketType;
        }
    }

    /* Models a literal character. */
    class LatexCharacter extends LatexNode
    {
        constructor(arg){
            super("char", arg);
        }
    }

    class LatexEnvironment extends LatexNode
    {
        constructor(envType, arg)
        {
            super("environment", arg);
            this.envType = envType;
        }
    }
}
root
= expressions:expression*{return new LatexNode("root", expressions)}

/* Note: LatexExpression argument must be an array. */
expression
= units:unit+ {
    return new LatexExpression(units);
    }
/ expression_curly_bracketed
/ expression_round_bracketed
/ expression_square_bracketed


expression_curly_bracketed
= "{" inner:root "}" {
    let arg = [];
    arg.push(inner);
    return new LatexExpression(arg, "curly");}


expression_round_bracketed
="(" inner:root ")" {
    let arg = [];
    arg.push(inner);
    return new LatexExpression(arg, "round");}

expression_square_bracketed
= "[" inner:root "]" {
    let arg = [];
    arg.push(inner);
    return new LatexExpression(arg, "square");
}

unit
= left:function {
    return left;
}
/ left:degrees  {
    return left;
}
/ left:environment {
    return left;
}
/ left:calcunit {
    return left;
}

degrees
= arg:number _ "^" _ "{" _ "\\circ" _ "}" {
    return new LatexFunction("degrees", [arg]);
} /
arg:argument  "^" _ "{"? _ "\\circ" _ "}"? {
    return new LatexFunction("degrees", [arg]);
}

/* FUNCTIONS */
function "function"
=
regular_function
/ fraction 
/ absolute_value
/ mean
/ sqrt
/ integral
/ binomial
/ logarithm
/ limit
/ derivative 
/ latex_function
/ latex_function_inverse

function_exponent
= _ exp:expression_curly_bracketed _ {return exp;}
/ _ exp:char _ {return exp;}
/ _ exp:number _ {return exp;}

function_letter
= ltr:("f" / "g" / "h") {
    return new LatexCharacter(ltr);
}

argument
= _ arg:expression_curly_bracketed _ {return arg;}
/_ arg:(char / number) _ {return arg;}

extra_argument
= expression_square_bracketed


/* Argument that may not need to have brackets*/
floating_argument
= root

absolute_value
= '|' arg:floating_argument '|' {return new LatexFunction("abs", [arg]);}

/* TO WRITE TRANSLATION FOR: */
binomial
= "\\displaystyle" _ "\\binom" n:argument k:argument {
    return new LatexFunction("binomial", [n, k]);
}

logarithm
=
"\\log" _ "_" ("{" _ "10" _ "}" / "10" ) arg:argument {
    return new LatexFunction("logarithm_10", [arg]);
}
/ "\\log" arg:argument {
    return new LatexFunction("logarithm_10", [arg]);
}
/"\\log" _ "_" base:argument arg:argument {
    return new LatexFunction("logarithm", [base, arg]);
}
/ "\\ln" arg:argument {
    return new LatexFunction("logarithm_ln" [arg])
}
/ exponentiated_logarithm


exponentiated_logarithm
=
"\\log" _ "^" exp:function_exponent  "_" ("{" _ "10" _ "}" / "10" ) arg:argument{
    return new LatexFunction("logartihm_10", [arg], exp);}
/"\\log" _ "^" exp:function_exponent arg:argument {
    return new LatexFunction("logarithm_10", [arg], exp);
}
/"\\log" _ "^" exp:function_exponent "_" base:argument arg:argument{
    return new LatexFunction("logarithm", [base, arg], exp);
}
/ "\\ln" _ "^" exp:function_exponent arg:argument {
    return new LatexFunction("logarithm_ln", [arg], exp)
}

/* Lower: Thing => thing */
limit
= "\\displaystyle" _ "\\lim" _ "_" _ lower:limit_specifier arg:argument {
    return new LatexFunction("limit", [...lower, arg]);
}

limit_specifier
= "{" _ opvar1:operational_variable _ "\\longrightarrow" _ opvar2:operational_variable _ "}" {
    return [opvar1, opvar2];
}

latex_function
= name:function_letter _ input:expression_round_bracketed "=" arg:floating_argument {
    return new LatexFunction("latex_function", [name, input, arg])
}

latex_function_inverse
= name:function_letter _ "^" _ "{" _ "-" "1" _ "}" _ input:expression_round_bracketed "=" arg:floating_argument{
    return new LatexFunction("latex_function_inverse", [name, input, arg]);
}

derivative
= name:function_letter _ ("'" / "\\prime") _ "(" _ input:operational_variable _ ")" _ "=" arg:floating_argument{
    return new LatexFunction("derivative", [name, input, arg]);
}

regular_function
= "\\" name:registered_regular_function arg:regular_function_argument {
    return new LatexFunction("regular", [name, arg])
} / exponentiated_regular_function

exponentiated_regular_function
= "\\" name:registered_regular_function _ "^" exp:function_exponent arg:regular_function_argument {
    return new LatexFunction("regular", [name, arg], exp);
}

regular_function_argument
= _ exp:expression_curly_bracketed _ {return exp;}
/ _ arg:special_symbol _ {return new LatexCharacter(specialSymbols[arg]);}

fraction
= "\\frac" arg1:argument  arg2:argument {
    return new LatexFunction("fraction", [arg1, arg2]);
}

mean
= "\\overline" arg:argument {
    return new LatexFunction("mean", [arg]);
}

registered_regular_function
= name:(
"sinh"
/ "cosh"
/ "coth"
/ "cos"
/ "sec"
/ "tan"
/ "cot"
/ "ctg"
/ "csc"
/ "sin"
/ "acos"
/ "asin"
/ "arcsin"
/ "arccos"
/ "arcctg"
/ "arccot"
/ "arctan") {
    return new LatexCharacter(name);
}

operational_variable
= char
/ number

/* Argument must be array */
sqrt
= "\\sqrt" arg:argument {
    let argArr = [arg];
    return new LatexFunction("sqrt", argArr);}
/ "\\sqrt" n:extra_argument arg:argument{
    let argArr = [n, arg];
    return new LatexFunction("sqrt", argArr);
}

integral
= "\\displaystyle" _ "\\int" arg:argument _ "d" _ opvar:operational_variable{
    return new LatexFunction("integral", [arg, opvar]);
}
/"\\displaystyle" _ "\\int" _ "_" lb:argument "^" ub:argument arg:argument _ "d" _ opvar:operational_variable{
    return new LatexFunction("integral", [lb, ub, arg, opvar]);
}
/ "\\displaystyle" _ "\\int" _ "^" ub:argument "_" lb:argument arg:argument _ "d" _ opvar:operational_variable{
    return new LatexFunction("integral", [lb, ub, arg, opvar])
}



/* ENVIRONMENTS */

environment "environment"
= equations_system

equations_system
= "\\begin" _ "{cases}" arg:environment_argument+ last_arg:root "\\end" _ "{cases}" {
    arg.push(last_arg);
    return new LatexEnvironment("system", arg);
}

environment_argument
= arg:root "\\\\" {return arg;}


/* TERMINALS */

/* Note: Eats spaces */
calcunit "number" 
= terminals:(number / char / operator / " " )+ {
    let terminalsNoSpaces = [];
    for(let terminal of terminals)
    {
        if (terminal != ' ')
        {
            terminalsNoSpaces.push(terminal);
        }
    }
    return new LatexCalcunit(terminalsNoSpaces);
}

operator
= arg:[+\-*/\^=<>._] {
    return new LatexCharacter(arg);
}

char
= char:[a-zA-Z+\-*/] {
    return new LatexCharacter(char);
}
/ char:special_symbol {
    return new LatexCharacter(specialSymbols[char]);
}

special_symbol "special symbol"
= "\\pi"
/"\\infty"
/"\\alpha"
/"\\beta"
/"\\lambda"
/"\\gamma"
/"\\epsilon"
/"\\rho"
/"\\delta"
/"\\sigma"
/"\\theta"

_ "whitespace or endline"
= [ \t\r\n]*

number
= digits:[0-9.]+ {
    return new LatexCharacter(digits.join(''));
}