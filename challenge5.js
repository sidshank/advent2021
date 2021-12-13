const path = require('path');
const readLinesInFile = require('./utils/readLinesInFile');
const { range, filter, partition } = require('lodash');

const lines = readLinesInFile(path.join(__dirname, 'challenge5_input.txt'));
const coordinatePairs = lines.map((line) =>
    line.match(/\d+/g).map((match) => Number(match))
);

function isStraightLine(coordinatePair) {
    return (
        coordinatePair[0] === coordinatePair[2] ||
        coordinatePair[1] === coordinatePair[3]
    );
}

// part 1
const [straightLineCoordinatePairs, diagonalLineCoordinatePairs] = partition(
    coordinatePairs,
    (coordinatePair) => isStraightLine(coordinatePair)
);

console.log(`========== Challenge 5 ==========`);

function getStepValue(start, end) {
    return start > end ? -1 : 1;
}

function getNumberOfPointsWithOverlappingLines(
    pointToOverlapCountMap,
    threshold
) {
    return filter(pointToOverlapCountMap, (value) => value >= threshold).length;
}

let coordinateToOverlapFrequencyMap = {};

// Part 1
for (let coordinatePair of straightLineCoordinatePairs) {
    if (coordinatePair[0] === coordinatePair[2]) {
        const xValue = coordinatePair[0];
        const step = getStepValue(coordinatePair[1], coordinatePair[3]);
        const yRange = range(coordinatePair[1], coordinatePair[3] + step, step);
        for (let yValue of yRange) {
            const key = xValue + '-' + yValue;
            if (coordinateToOverlapFrequencyMap[key]) {
                coordinateToOverlapFrequencyMap[key]++;
            } else {
                coordinateToOverlapFrequencyMap[key] = 1;
            }
        }
    } else {
        const yValue = coordinatePair[1];
        const step = getStepValue(coordinatePair[0], coordinatePair[2]);
        const xRange = range(coordinatePair[0], coordinatePair[2] + step, step);
        for (let xValue of xRange) {
            const key = xValue + '-' + yValue;
            if (coordinateToOverlapFrequencyMap[key]) {
                coordinateToOverlapFrequencyMap[key]++;
            } else {
                coordinateToOverlapFrequencyMap[key] = 1;
            }
        }
    }
}

console.log(
    `Number of points where 2 or more straight lines overlap is ${getNumberOfPointsWithOverlappingLines(
        coordinateToOverlapFrequencyMap,
        2
    )}`
);

// Part 2
for (let coordinatePair of diagonalLineCoordinatePairs) {
    const xStep = getStepValue(coordinatePair[0], coordinatePair[2]);
    const xRange = range(coordinatePair[0], coordinatePair[2] + xStep, xStep);
    const yStep = getStepValue(coordinatePair[1], coordinatePair[3]);
    const yRange = range(coordinatePair[1], coordinatePair[3] + yStep, yStep);
    for (let rangeIndex = 0; rangeIndex < xRange.length; rangeIndex++) {
        const xValue = xRange[rangeIndex];
        const yValue = yRange[rangeIndex];
        const key = xValue + '-' + yValue;
        if (coordinateToOverlapFrequencyMap[key]) {
            coordinateToOverlapFrequencyMap[key]++;
        } else {
            coordinateToOverlapFrequencyMap[key] = 1;
        }
    }
}

console.log(
    `Number of points where 2 or more diagonal lines overlap is ${getNumberOfPointsWithOverlappingLines(
        coordinateToOverlapFrequencyMap,
        2
    )}`
);
