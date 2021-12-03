const path = require('path');
const readLinesInFile = require('./utils/readLinesInFile');

const input = readLinesInFile(path.join(__dirname, 'challenge1_input.txt'));

function findNumberOfIncreases(numbers) {
    return numbers.reduce((increases, current, index) => {
        if (index === 0) return increases;
        return increases + (current > numbers[index - 1] ? 1 : 0);
    }, 0);
}

function makeThreeNumberSums(numbers) {
    return numbers.reduce((windowSums, number, currentIndex) => {
        if (currentIndex >= 2) {
            return [
                ...windowSums,
                number + numbers[currentIndex - 1] + numbers[currentIndex - 2],
            ];
        } else {
            return windowSums;
        }
    }, []);
}

console.log(`========== Challenge 1 ==========`);
// Part 1
const inputNumbers = input.map((item) => Number(item));
const increases = findNumberOfIncreases(inputNumbers);
console.log(`Number of increases is: ${increases}`);

// Part 2
const threeNumberSums = makeThreeNumberSums(inputNumbers);
const threeNumberSumIncreases = findNumberOfIncreases(threeNumberSums);
console.log(`Number of 3-number window sum increases is: ${threeNumberSumIncreases}`);
