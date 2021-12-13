const {
    flatten,
    find,
    sortBy,
    difference,
    countBy,
    findKey,
} = require('lodash');
const path = require('path');
const readLinesInFile = require('./utils/readLinesInFile');

const lines = readLinesInFile(path.join(__dirname, 'challenge8_input.txt'));
console.log(`========== Challenge 8 ==========`);
// Part 1

// Active segment counts of numbers 1,4,7 & 8
const segmentCountOfNumbersWithUniquePattern = new Set([2, 3, 4, 7]);

const numDigitsWithUniqueSegments = flatten(
    lines.map((line) => line.split('|')[1].trim().split(' '))
).filter((digitRepresentation) =>
    segmentCountOfNumbersWithUniquePattern.has(digitRepresentation.length)
).length;

console.log(
    `Number of times 1,4,7 & 8 appear in the output values: ${numDigitsWithUniqueSegments}`
);

// Part 2
const { signalPatterns, outputValueSignals } = lines
    .map((line) => line.split(' | '))
    .reduce(
        (acc, splitLine) => {
            return {
                signalPatterns: [...acc.signalPatterns, splitLine[0]],
                outputValueSignals: [...acc.outputValueSignals, splitLine[1]],
            };
        },
        { signalPatterns: [], outputValueSignals: [] }
    );

const segmentToValueMap = {
    abcefg: 0,
    cf: 1,
    acdeg: 2,
    acdfg: 3,
    bcdf: 4,
    abdfg: 5,
    abdefg: 6,
    acf: 7,
    abcdefg: 8,
    abcdfg: 9,
};

function getOutputValueFromSignalPattern(signalPattern, outputValueSignal) {
    const letterToCountMap = countBy(signalPattern);
    delete letterToCountMap[' '];
    const signals = signalPattern.split(' ');
    const sortedSignals = sortBy(signals, (signal) => signal.length);
    const signalToSegmentMap = {
        a: null,
        b: null,
        c: null,
        d: null,
        e: null,
        f: null,
        g: null,
    };
    const signalForOne = [...sortedSignals[0]];
    const signalForSeven = [...sortedSignals[1]];

    const topSegmentSignal = difference(signalForSeven, signalForOne)[0];
    signalToSegmentMap[topSegmentSignal] = 'a';

    // The top left segment is the only segment that shows up
    // in 6 digits.
    const topLeftSegmentSignal = findKey(
        letterToCountMap,
        (value) => value === 6
    );
    signalToSegmentMap[topLeftSegmentSignal] = 'b';

    // The bottom left segment is the only segment that shows up
    // in 4 digits.
    const bottomLeftSegmentSignal = findKey(
        letterToCountMap,
        (value) => value === 4
    );
    signalToSegmentMap[bottomLeftSegmentSignal] = 'e';

    // Determine the middle segment by taking the set difference
    // of the segments that represent 4, and the segments on the
    // top left + top & bottom right.
    const signalForFour = [...sortedSignals[2]];
    const middleSegmentSignal = difference(signalForFour, [
        topLeftSegmentSignal,
        ...signalForOne,
    ])[0];
    signalToSegmentMap[middleSegmentSignal] = 'd';

    // Determine the bottom segment by taking the set difference
    // of the segments that represent 8, and all other segments.
    const signalForEight = [...sortedSignals[sortedSignals.length - 1]];
    const bottomSegmentSignal = difference(signalForEight, [
        ...signalForFour,
        topSegmentSignal,
        bottomLeftSegmentSignal,
    ])[0];
    signalToSegmentMap[bottomSegmentSignal] = 'g';

    // Determine the top right signal by finding the segments
    // that represent the digit 2, and taking the difference of
    // the set of segments in the digit 2, and the set of all
    // segments except the top right.
    const signalForTwo = [
        ...find(
            sortedSignals,
            (signal) =>
                signal.length === 5 &&
                [...signal].includes(bottomLeftSegmentSignal)
        ),
    ];
    const topRightSegmentSignal = difference(signalForTwo, [
        topSegmentSignal,
        middleSegmentSignal,
        bottomLeftSegmentSignal,
        bottomSegmentSignal,
    ])[0];
    signalToSegmentMap[topRightSegmentSignal] = 'c';

    // ... what remains is the bottom-right segment.
    const bottomRightSegmentSignal = findKey(
        signalToSegmentMap,
        (value) => value === null
    );
    signalToSegmentMap[bottomRightSegmentSignal] = 'f';

    const outputValueSignalSplit = outputValueSignal.split(' ');
    const outputValueSignalString = outputValueSignalSplit.reduce(
        (acc, outputValue) => {
            const decodedOutputSignal = [...outputValue]
                .map((signalValue) => signalToSegmentMap[signalValue])
                .sort()
                .join('');
            return acc + segmentToValueMap[decodedOutputSignal];
        },
        ''
    );
    return Number(outputValueSignalString);
}

const sumOfOutputSignals = signalPatterns.reduce(
    (acc, signalPattern, signalIndex) => {
        return (
            acc +
            getOutputValueFromSignalPattern(
                signalPattern,
                outputValueSignals[signalIndex]
            )
        );
    },
    0
);
console.log(`Sum of all decoded output values: ${sumOfOutputSignals}`);
