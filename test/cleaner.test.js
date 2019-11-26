let cleaner = require("../src/cleaner");


test("Textcolor", () => {
    let latexExp = "\\textcolor{primary}{2x+3}";
    expect(cleaner.clean(latexExp)).toBe("2x+3");
})

test("Recursive cleaning and removing text", () => {
    let latexExp = String.raw`\textcolor{primary}{5\text{in}}`;
    expect(cleaner.clean(latexExp)).toBe("5");
})

test("Converting operators", () => {
    let latexExp = String.raw`2x+3\leq 5\geq 20\div 30\cdot 15`;
    expect(cleaner.clean(latexExp)).toBe("2x+3<= 5>= 20/ 30* 15");
})

test("Throws CleanerError when textcolor misses arguments" ,() => {
    let latexExp = String.raw`\textcolor{10x+3}`;
    expect(() => {cleaner.clean(latexExp)}).toThrow();
})

test("Clean ampersand everywhere except within matrix", () => {
    let latexExp = String.raw`2&3\begin{vmatrix}&\end{vmatrix}&`;
    expect(cleaner.clean(latexExp)).toBe(String.raw`2 3\begin{vmatrix}&\end{vmatrix} `);
})