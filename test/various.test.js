let ltp = require("latex-to-photomath");
let ltx = require("./latex_expressions");


test("Comma", () => {
    expect(ltp("123,045")).toBe("123045");
})

test("Factorial", () => {
    expect(ltp(String.raw`\textcolor{primary}{n!}`)).toBe("n!");
})

test("Basic fraction", () => {
    expect(ltp(ltx.fraction.input)).toBe(ltx.fraction.expected);
})

test("Determinant with logarithm", () => {
    expect(ltp(ltx.detWithLogarithm.input)).toBe(ltx.detWithLogarithm.expected);
})

test("Cdot", () => {
    expect(ltp(ltx.cdot.input)).toBe(ltx.cdot.expected);
})

test("Integral", () => {
    expect(ltp(ltx.integral.input)).toBe(ltx.integral.expected);
})

test("Natural logarithm", () => {
    expect(ltp(ltx.ln.input)).toBe(ltx.ln.expected);
})

test("Limit", () => {
    expect(ltp(ltx.limit.input)).toBe(ltx.limit.expected);
})

test("Various trig functions", () => {
    expect(ltp(ltx.trig.input)).toBe(ltx.trig.expected);
})

test("Simple degrees of the form 5^{\\circ}", () => {
    expect(ltp(ltx.deg.input)).toBe(ltx.deg.expected);
})

test("Degrees of the form {5x+{23}}^{\\circ}", () => {
    expect(ltp(ltx.deg2.input)).toBe(ltx.deg2.expected);
})

test("Latex function", () => {
    expect(ltp(ltx.latex_function.input)).toBe(ltx.latex_function.expected);
})

test("Latex function inverse", () => {
    expect(ltp(ltx.latex_function_inverse.input)).toBe(ltx.latex_function_inverse.expected);
})