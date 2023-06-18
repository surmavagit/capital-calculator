const data = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined]
]

const userInput = []; // maximum length is 3

// const groups = [
//     [[0, 0], [1, 1], [2, 2]],
//     [[0, 1], [1, 0]],
//     [[0, 2], [2, 0]],
//     [[1, 2], [2, 1]]
// ]


// enter function is only meant to work on undefined slots

function enter(line, column, value) {
    userInput.push([line, column]);
    if (line === column) {
        userInput[userInput.length - 1].group = 0;
    } else {
        userInput[userInput.length - 1].group = line + column;
    }
    data[line][column] = value;
    calculate();
    console.table(data);
}

function cancel(inputIndex) {
    userInput.splice(inputIndex, 1);
    calculate();
    console.table(data);
}

function calculate() {
    refresh();
    if (userInput.length > 0) {
        userInput.forEach(input => {
            if (input.group > 0) {
                fillCounterpart(input);
            }
        })
        if (userInput.length > 1) {
            if (userInput.length === 3) {
                checkSpecialCase();
            }
            fillLines();
        }
    }
}

function fillCounterpart(arr) {
    data[arr[1]][arr[0]] = data[arr[0]][arr[1]];
}

function checkSpecialCase() {
    let inputCounter = 0;
    userInput.forEach(input => {
        inputCounter += input.group;
    })
    if (inputCounter === 0) {
        data[1][0] = (data[2][2] - data[1][1] - data[0][0])/2;
        fillCounterpart([1, 0]);
    }
}

function fillTheLine(line, lineNumber) {
    let emptySlot;
    line.forEach((element, index) => {
        if (element === undefined) {
            emptySlot = index;
        }
    })
    if (emptySlot === 0) {
        line[0] = line[2] - line[1];
        fillCounterpart([lineNumber, 0]);
    } else if (emptySlot === 1) {
        line[1] = line[2] - line[0];
        fillCounterpart([lineNumber, 1]);
    } else if (emptySlot === 2) {
        line[2] = line[0] + line[1];
        fillCounterpart([lineNumber, 2]);
    }
}

function fillLines() {
    let changes = 0;
    do {
        changes = 0;
        data.forEach((line, index) => {
            let definedCounter = 0;
            line.forEach(element => {
                if (element !== undefined) {
                    definedCounter++;
                }
            })
            if (definedCounter === 2) {
                fillTheLine(line, index);
                changes++;
            }
        })
    } while (changes > 0);
}

function refresh() {
    const saveData = [];
    const x = userInput.length;
    if (x > 0) {
        userInput.forEach(element => {
            saveData.push(data[element[0]][element[1]]);
        })
    }
    data.forEach((line, index) => {
        for (let i = 0; i < 3; i++) {
            data[index][i] = undefined;
        }
    })
    if (x > 0) {
        userInput.forEach((element, index) => {
            data[element[0]][element[1]] = saveData[index];
        })
    }
}