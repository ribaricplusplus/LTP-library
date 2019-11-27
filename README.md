How to install
=============================
To make the installation as simple as possible, LTP is packaged with webpack
by the Unified Model Definition (UMD). Thereby, it can be integrated just like any other
UMD package.

Method 1 - Install as node module 
----------------------------

1. Download the tarball file from google drive: link
2. Run `npm install path/to/ltp-1.0.0.tgz --production`
3. LTP can now be accessed as
        const ltp = require("ltp");

Method 2 - Install by direct loading
----------------------------

1. Download the bundle from google drive: link
2. Load the script into the site:
        <script src="ltp.js"></script>
3. The ltp function becomes available globally.

How to use
==============================
Run the input to Solver through LTP before passing it forwards.  
LTP comes with good error reporting which can be output to the user by printing the error object's message.  
The implementation code should look something like this:
    try{
        inputForSolver = ltp(inputFromUser);
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