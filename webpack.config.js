let path = require('path');

module.exports = {
    mode:"production",
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename:"ltp.js",
        library:"latexToPhotomath",
        libraryTarget:"umd"
    },
    entry:"./src/ltp.js"
}