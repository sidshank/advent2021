const { countBy, transform, clone, values, sum } = require('lodash');
const path = require('path');
const readLinesInFile = require('./utils/readLinesInFile');

const line = readLinesInFile(path.join(__dirname, 'challenge6_input.txt'));
const lanternFishTimerValues = line[0]
    .split(',')
    .map((timerValue) => Number(timerValue));

function createLanternFishTimerDistribution(lanternFishTimerValues) {
    return {
        '0': 0,
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
        '7': 0,
        '8': 0,
        ...countBy(lanternFishTimerValues),
    };
}

let initialState = createLanternFishTimerDistribution(lanternFishTimerValues);

function iterateLanternFish(initialState) {
    const accumulator = clone(initialState);
    const resetCount = accumulator[0];
    const nextState = transform(initialState, (acc, value, key) => {
        const numericKey = Number(key);
        if (numericKey === 0) {
            return acc;
        } else {
            acc[(numericKey - 1) + ''] = acc[key];
        }
    }, accumulator);
    nextState['6'] = nextState['6'] + resetCount;
    nextState['8'] = resetCount;
    return nextState;
}

console.log(`========== Challenge 6 ==========`);

for (let day = 1; day <= 256; day++) {
    const nextState = iterateLanternFish(initialState);
    initialState = nextState;
    if (day === 80) {
        // Part 1
        console.log(`Number of fish after 80 days: ${sum(values(initialState))}`);
    }
}

// Part 2
console.log(`Number of fish after 256 days: ${sum(values(initialState))}`);