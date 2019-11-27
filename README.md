How to install
=============================
To make the installation as simple as possible, Latex to Photomath (LTP) is packaged
by the Unified Model Definition (UMD). Thereby, it can be integrated just like any other
UMD package.

Method 1 - Install as node module 
----------------------------

1. Download the tarball file from google drive: [link](https://drive.google.com/file/d/1Qe_AOLkT_ZhNX5h2U08eU8OAO-hQiiJw)
2. Run `npm install path/to/latex-to-photomath-1.0.0.tgz`
3. LTP can now be accessed as
        const latexToPhotomath = require("latex-to-photomath");

Method 2 - Install by direct loading
----------------------------

1. Download the bundle from google drive: [link](https://drive.google.com/open?id=1pDHNjFIPn6femwcTkyusV1xoVCZFmHT3)
2. Load the bundle into the site:
        <script src="ltp.js"></script>
3. The latexToPhotomath function becomes available globally.

How to use
==============================
Run the input to Solver through LTP before passing it forwards.  
LTP comes with good error reporting which can be output to the user by printing the error object's message.  
The implementation code should look something like this:
    try{
        inputForSolver = latexToPhotomath(inputFromUser);
    } catch (err) {
        if (err.name === "LtpError")
        {
            Output err.message to user
        }
    }

Future improvements
============================
LTP understands all LaTeX that the Photomath app can display.
It is expected that, in the future, more LaTeX syntax will be implemented into the app.
For this reason, LTP is built to be scalable. New LaTeX tokens can easily be implemented.
The general overview of how a new LaTeX function "\myLatexFunc{a}" would be implemented:

1. Add "myLatexFunc" to one-argument functions in the grammar.
2. Write a "myLatexFunc" translator method that looks something like this:
        myfunc: (functionObject) => "mySolverFunc(" + functionObject.arg + ")";


Notes for the end user (who inputs LaTeX to CMS)
===========================
Due to the innate ambiguity of LaTeX, there are some known restrictions to LTP:

1. Integrals must be written in the form: \displaystyle\int_a^b{funcHere}dx
2. Degrees must be written in the form: {50}^{\circ}
3. The following solver functions are not implemented in LaTeX form: mean, nderivation, percent, line_segment_length