const path = require('path');
const readLinesInFile = require('./utils/readLinesInFile');
const { keys } = require('lodash');

const lines = readLinesInFile(path.join(__dirname, 'challenge4_input.txt'));
const bingoSequence = lines[0].split(',');
const bingoBoards = [];
let currentBoard = [];
for (let index = 2, boardIndex = 0; index < lines.length; index++) {
    const line = lines[index].trim().replaceAll('  ', ' ');
    if (line === '') {
        bingoBoards.push(currentBoard);
        currentBoard = [];
        boardIndex++;
        continue;
    }
    const rowEntries = line
        .split(' ')
        .map((entry) => ({ value: entry, marked: false }));
    currentBoard.push(rowEntries);
}

const bingoSequenceLocations = bingoSequence.reduce((acc, item) => {
    return { ...acc, [item]: {} };
}, {});
for (let boardIndex = 0; boardIndex < bingoBoards.length; boardIndex++) {
    const currentBoard = bingoBoards[boardIndex];
    for (let rowIndex = 0; rowIndex < currentBoard.length; rowIndex++) {
        for (let colIndex = 0; colIndex < currentBoard[0].length; colIndex++) {
            const { value } = currentBoard[rowIndex][colIndex];
            if (bingoSequenceLocations[value]) {
                if (bingoSequenceLocations[value][boardIndex]) {
                    bingoSequenceLocations[value][boardIndex].push([
                        rowIndex,
                        colIndex,
                    ]);
                } else {
                    bingoSequenceLocations[value][boardIndex] = [
                        [rowIndex, colIndex],
                    ];
                }
            }
        }
    }
}

const boardRowsCalledCount = {};
const boardColumnCalledCount = {};

function trackRowsOrColumnCalled(data, boardIndex, rowOrColumnIndex) {
    const jointIndex = boardIndex + '-' + rowOrColumnIndex;
    if (data[jointIndex]) {
        data[jointIndex] += 1;
    } else {
        data[jointIndex] = 1;
    }
    return data[jointIndex];
}

function calculateScore(board, called) {
    const calledNumber = Number(called);
    const unmarkedNumbersSum = board
        .flat()
        .filter((item) => item.marked === false)
        .map(({ value }) => Number(value)).reduce((acc, currentValue) => {
            return acc + currentValue;
        }, 0);
    return calledNumber * unmarkedNumbersSum;
}

console.log(`========== Challenge 4 ==========`);

let boardsThatHaveWon = new Set();

// Start calling out numbers
outer: for (
    let sequenceIndex = 0;
    sequenceIndex < bingoSequence.length;
    sequenceIndex++
) {
    const bingoCall = bingoSequence[sequenceIndex];
    const boardsAndLocations = bingoSequenceLocations[bingoCall];
    const boards = keys(boardsAndLocations);
    for (let boardIndex of boards) {
        const locations = boardsAndLocations[boardIndex];
        for (
            let locationIndex = 0;
            locationIndex < locations.length;
            locationIndex++
        ) {
            const [rowIndex, columnIndex] = locations[locationIndex];
            bingoBoards[boardIndex][rowIndex][columnIndex].marked = true;
            const markedInRowCount = trackRowsOrColumnCalled(
                boardRowsCalledCount,
                boardIndex,
                rowIndex
            );
            const markedInColumnCount = trackRowsOrColumnCalled(
                boardColumnCalledCount,
                boardIndex,
                columnIndex
            );
            if ((
                markedInRowCount === bingoBoards[boardIndex].length ||
                markedInColumnCount === bingoBoards[boardIndex][0].length
            ) && !boardsThatHaveWon.has(boardIndex)) {
                console.log(`Board number ${boardIndex} won!!!`);
                const winningScore = calculateScore(
                    bingoBoards[boardIndex],
                    bingoCall
                );
                console.log(`Score of the board is: ${winningScore}`)
                // break outer; --> Uncomment to stop at Part 1.
                boardsThatHaveWon.add(boardIndex);

            }
        }
    }
}
