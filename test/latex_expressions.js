module.exports = {
    fraction:{
        input:"\\frac{2}{3}",
        expected:"{{2}/{3}}"
    },

    fraction2:{
        input:String.raw`\frac{6|4y-2|}{\textcolor{primary}{6}}\geq \frac{42}{\textcolor{primary}{6}}`,
        expected:"{{6abs(4y-2)}/{6}}>={{42}/{6}}"
    },

    systemOfEquations:{
        input:String.raw`\begin{cases} 2x+3=7\\ 5+\log_2{x}x=16 \end{cases}`,
        expected:"system(2x+3=7,5+log(2, x)x=16)"
    },

    alignedSystemOfEquations:{
        input:String.raw`\begin{align}2x+3y &= 7\\4x+7y &= 1\end{align}`,
        expected: "system(2x+3y=7,4x+7y=1)"
    },

    det3:{
        input:String.raw`\begin{bmatrix} 5 & -3 & 7 \\ -1 & 0 & 8 \\ 3 & 3 & 3\end{bmatrix}`,
        expected:"det3(5,-3,7,-1,0,8,3,3,3)"
    },

    det2:{
        input:String.raw`\begin{bmatrix} 5 & -3 \\ -1 & 0 \end{bmatrix}`,
        expected:"det2(5,-3,-1,0)"
    },

    detWithLogarithm:{
        input:String.raw`\begin{bmatrix} \log_{2}{3} & -3 \\ -1 & 0 \end{bmatrix}`,
        expected:"det(log(2, 3),-3,-1,0)"
    },

    sqrt:{
        input:String.raw`\sqrt[5]{2x+3}`,
        expected:"root(5, 2x+3)"
    },

    cdot:{
        input:String.raw`\frac{1}{2}\cdot\frac{5}{6}`,
        expected:"{{1}/{2}}*{{5}/{6}}"
    },

    integral:{
        input:String.raw`\displaystyle\int_a^b{\frac{1}{2}x^2+3}dx`,
        expected:"definiteintegral(a, b, {{1}/{2}}x^2+3, x)"
    },

    ln:{
        input:String.raw`\ln{\frac{1}{2}}`,
        expected:"ln({{1}/{2}})"
    },

    limit:{
        input:String.raw`\displaystyle \lim_{x \to c}{a}`,
        expected:"lim(x,c,a)"
    },

    trig:{
        input:String.raw`\sin{\frac{1}{2}}+\tan{\frac{1}{2}}+\tg{\frac{1}{2}}+\cos{\frac{1}{2}}`,
        expected:"sin({{1}/{2}})+tan({{1}/{2}})+tan({{1}/{2}})+cos({{1}/{2}})"
    },

    deg:{
        input:String.raw`\sin{5^{\circ}}`,
        expected:"sin(deg(5))"
    },

    deg2:{
        input:String.raw`\sin{5x+23^\circ}`,
        expected:"sin(5x+deg(23)"
    },

    latex_function:{
        input:String.raw`f(x)=\frac{1}{2}x+3`,
        expected:"function(f,x)={{1}/{2}}x+3"
    },

    latex_function_inverse:{
        input:String.raw`f^{-1}(x)=\frac{1}{2}x+3`,
        expected:"function_inverse(f,x)={{1}/{2}}x+3"
    },
}