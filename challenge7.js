const path = require('path');
const readLinesInFile = require('./utils/readLinesInFile');

const line = readLinesInFile(path.join(__dirname, 'challenge7_input.txt'))[0];
const sortedHorizontalPositions = line
    .split(',')
    .map((value) => Number(value))
    .sort((a, b) => a - b);

function median(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

function calculateConstantStepFuel(position, alignmentPosition) {
    return Math.abs(position - alignmentPosition);
}

console.log(`========== Challenge 7 ==========`);
// Part 1
const medianHorizontalPosition = median(sortedHorizontalPositions);
const totalConstantStepFuel = sortedHorizontalPositions.reduce(
    (totalFuel, value) => {
        return (
            totalFuel +
            calculateConstantStepFuel(value, medianHorizontalPosition)
        );
    },
    0
);
console.log(
    `Fuel required to get crabs into alignment assuming constant fuel per step: ${totalConstantStepFuel}`
);

// Part 2
const averageHorizontalPosition =
    sortedHorizontalPositions.reduce((sum, value) => sum + value, 0) /
    sortedHorizontalPositions.length;

function calculateIncreasingStepFuel(position, alignmentPosition) {
    const difference = Math.abs(position - alignmentPosition);
    if (difference < 2) {
        return difference;
    }
    return (difference * (difference + 1)) / 2;
}

const averagePositionFloor = Math.floor(averageHorizontalPosition);
const totalIncreasingStepFuel = sortedHorizontalPositions.reduce(
    (totalFuel, value) => {
        return (
            totalFuel + calculateIncreasingStepFuel(value, averagePositionFloor)
        );
    },
    0
);

console.log(
    `Fuel required to get crabs into alignment assuming increasing fuel per step: ${totalIncreasingStepFuel}`
);