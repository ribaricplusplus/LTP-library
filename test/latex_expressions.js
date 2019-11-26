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

    det3:{
        input:String.raw`\begin{bmatrix} 5 & -3 & 7 \\ -1 & 0 & 8 \\ 3 & 3 & 3\end{bmatrix}`,
        expected:"det3(5,-3,7,-1,0,8,3,3,3)"
    },

    det2:{
        input:String.raw`\begin{bmatrix} 5 & -3 \\ -1 & 0 \end{bmatrix}`,
        expected:"det2(5,-3,-1,0)"
    },
}