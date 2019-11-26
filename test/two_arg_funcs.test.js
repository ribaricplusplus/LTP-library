let ltp = require ("ltp");
let ltx = require("./latex_expressions");

test("Basic fraction", () => {
    console.log(ltp);
    expect(ltp(ltx.fraction.input)).toBe(ltx.fraction.expected);
})