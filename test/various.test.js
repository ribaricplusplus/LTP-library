let ltp = require("ltp");
let ltx = require("./latex_expressions");


test("Comma", () => {
    expect(ltp("123,045")).toBe("123045");
})

test("Factorial", () => {
    expect(ltp(String.raw`\textcolor{primary}{n!}`)).toBe("n!");
})