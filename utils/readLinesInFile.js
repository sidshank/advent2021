var fs = require('fs');
function readLinesInFile(filePath) {
    return fs.readFileSync(filePath).toString().split('\n');
}

module.exports = readLinesInFile;
