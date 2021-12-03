const path = require('path');
const readLinesInFile = require('./utils/readLinesInFile');
const { unzip, partition, gt, lt } = require('lodash');

const input = readLinesInFile(path.join(__dirname, 'challenge3_input.txt'));
const rowArraysOfBits = input.map((line) => [...line]);

function transpose(matrix) {
    return unzip(matrix);
}

function getCommonAndUncommonBitCounts(arrayOfBits) {
    return arrayOfBits.reduce(
        (acc, bitValue) => {
            if (bitValue === '1') {
                return { ...acc, onesBitCount: acc.onesBitCount + 1 };
            }
            return { ...acc, zeroesBitCount: acc.zeroesBitCount + 1 };
        },
        { onesBitCount: 0, zeroesBitCount: 0 }
    );
}

function findGammaAndEpsilon({ columnArraysOfBits }) {
    return columnArraysOfBits.reduce(
        (acc, columnArray) => {
            const bitCounts = getCommonAndUncommonBitCounts(columnArray);
            if (bitCounts.onesBitCount >= bitCounts.zeroesBitCount) {
                return { gamma: acc.gamma + '1', epsilon: acc.epsilon + '0' };
            }
            return { gamma: acc.gamma + '0', epsilon: acc.epsilon + '1' };
        },
        { gamma: '', epsilon: '' }
    );
}

function binaryStringToDecimalNumber(binaryString) {
    return parseInt(binaryString, 2);
}

const columnArraysOfBits = transpose(rowArraysOfBits);

console.log(`========== Challenge 3 ==========`);

// Part 1
const { gamma, epsilon } = findGammaAndEpsilon({ columnArraysOfBits });
console.log(
    `Power consumption of submarine is = ${
        binaryStringToDecimalNumber(gamma) *
        binaryStringToDecimalNumber(epsilon)
    }`
);

// Part 2
function findRow({ rowsOfBits, highestBitFrequencyInColumn, oneBitWinsTie }) {
    const bitLength = rowsOfBits[0].length;
    let filteredRows = rowsOfBits;

    for (let index = 0; index < bitLength; index++) {
        const [rowsWithOneBit, rowsWithZeroBit] = partition(
            filteredRows,
            (row) => row[index] === '1'
        );
        if (rowsWithOneBit.length === rowsWithZeroBit.length) {
            filteredRows = oneBitWinsTie ? rowsWithOneBit : rowsWithZeroBit;
        } else {
            const operation = highestBitFrequencyInColumn ? gt : lt;
            filteredRows = operation(
                rowsWithZeroBit.length,
                rowsWithOneBit.length
            )
                ? rowsWithZeroBit
                : rowsWithOneBit;
        }
        if (filteredRows.length === 1) {
            return filteredRows[0];
        }
    }
}

const oxygenGeneratorRatingRow = findRow({
    rowsOfBits: rowArraysOfBits,
    highestBitFrequencyInColumn: true,
    oneBitWinsTie: true,
});
const oxygenGeneratorRating = binaryStringToDecimalNumber(
    oxygenGeneratorRatingRow.join('')
);

const carbonDioxideScrubberRatingRow = findRow({
    rowsOfBits: rowArraysOfBits,
    highestBitFrequencyInColumn: false,
    oneBitWinsTie: false,
});
const carbonDioxideScrubberRating = binaryStringToDecimalNumber(
    carbonDioxideScrubberRatingRow.join('')
);

console.log(
    `Life support rating of submarine is = ${
        oxygenGeneratorRating * carbonDioxideScrubberRating
    }`
);
