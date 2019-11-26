let ltp = require("ltp");
let ltx = require("./latex_expressions");


test("System of equations, sprinkled with some logarithms.", () => {
    expect(ltp(ltx.systemOfEquations.input)).toBe(ltx.systemOfEquations.expected);
})

test("2x2 matrix determinant", () => {
    expect(ltp(ltx.det2.input)).toBe(ltx.det2.expected);
})

test("3x3 matrix determinant", () => {
    expect(ltp(ltx.det3.input)).toBe(ltx.det3.expected);
})