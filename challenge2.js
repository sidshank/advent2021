const path = require('path');
const readLinesInFile = require('./utils/readLinesInFile');

const input = readLinesInFile(path.join(__dirname, 'challenge2_input.txt'));

function convertLineToInstruction(line) {
    const [direction, magnitude] = line.split(' ');
    return [direction, Number(magnitude)];
}

console.log(`========== Challenge 2 ==========`);

// Part 1
function findTotalHorizontalAndDepth(inputLines) {
    return inputLines.reduce(
        (acc, inputLine) => {
            const [direction, magnitude] = convertLineToInstruction(inputLine);
            if (direction === 'forward') {
                return { ...acc, horizontal: acc.horizontal + magnitude };
            } else if (direction === 'down') {
                return { ...acc, depth: acc.depth + magnitude };
            } else {
                return { ...acc, depth: acc.depth - magnitude };
            }
        },
        { horizontal: 0, depth: 0 }
    );
}

const { horizontal, depth } = findTotalHorizontalAndDepth(input);
console.log(`Horizontal * Depth = ${horizontal * depth}`);

// Part 2
function findTotalHorizontalAndDepthWithAim(inputLines) {
    return inputLines.reduce(
        (acc, inputLine) => {
            const [direction, magnitude] = convertLineToInstruction(inputLine);
            if (direction === 'forward') {
                return {
                    ...acc,
                    horizontal: acc.horizontal + magnitude,
                    depth: acc.depth + acc.aim * magnitude,
                };
            } else if (direction === 'down') {
                return { ...acc, aim: acc.aim + magnitude };
            } else if (direction === 'up') {
                return { ...acc, aim: acc.aim - magnitude };
            }
        },
        { horizontal: 0, depth: 0, aim: 0 }
    );
}

const { horizontal: horizontalWithAim, depth: depthWithAim } = findTotalHorizontalAndDepthWithAim(input);
console.log(`Horizontal with aim * Depth with aim = ${horizontalWithAim * depthWithAim}`);
