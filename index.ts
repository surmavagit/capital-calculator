const readline = require("readline");

type TabEntry = number | undefined;
type TabRow = [TabEntry, TabEntry, TabEntry];
type Table = [TabRow, TabRow, TabRow];

let matrix: Table = [
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
];

let inputCounter = 0;

const enter = (line: number, column: number, value: number) => {
  if (inputCounter > 2) {
    console.error("The table is already defined");
  } else if (matrix[line][column] !== undefined) {
    console.error("The variable is already defined");
  } else {
    matrix = define(matrix, line, column, value);
    inputCounter++;
    if (inputCounter > 1) matrix = calculate(matrix, inputCounter);
  }
  console.table(matrix);
};

const define = (arr: Table, x: number, y: number, assign: number) => {
  arr[x][y] = assign;
  //the table is symmetric
  if (x !== y) arr[y][x] = assign;
  return arr;
};

const calculate = (arr: Table, state: number) => {
  //special case when user defines [0,0], [1,1], [2,2]
  const [a, b, c] = arr.map((subArr, index) => subArr[index]);
  if (state === 3 && a !== undefined && b !== undefined && c !== undefined) {
    const d = (c - a - b) / 2;
    arr = define(arr, 1, 0, d);
  }
  //end of special case

  const checkRow = (row: TabRow) =>
    row.filter((entry) => entry !== undefined).length === 2;
  let rowIndex = -1;
  do {
    rowIndex = arr.findIndex(checkRow);
    if (rowIndex !== -1) {
      const [e, f, g] = arr[rowIndex];
      if (e !== undefined && f !== undefined) {
        arr = define(arr, rowIndex, 2, e + f);
      } else if (e !== undefined && g !== undefined) {
        arr = define(arr, rowIndex, 1, g - e);
      } else if (f !== undefined && g !== undefined) {
        arr = define(arr, rowIndex, 0, g - f);
      }
    }
  } while (rowIndex !== -1);
  return arr;
};

const textPrompt = "Enter 3 numbers, separated by spaces";
const textQuestion = [
  "There is a 3x3 matrix",
  textPrompt,
  "First for line number",
  "Second for column number",
  "Third for the input value",
  "(Lines and columns are zero-indexed) \n",
];
console.table(matrix);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.setPrompt(textQuestion.join("\n"));
rl.prompt();
rl.on("line", (answer: string) => {
  const nonDigits = (text: string) =>
    /^\D*$/.test(text) || /[^\d\s]/.test(text);
  const parseAnswer = (text: string) =>
    text
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .map((str) => +str);
  const nonIndex = (number: number) =>
    number !== 0 && number !== 1 && number !== 2;

  if (nonDigits(answer)) {
    console.log("Input that contains either no digits or any non-digits closes the program.");
    rl.close();
  } else {
    let answerArr = parseAnswer(answer);
    if (answerArr.length !== 3) {
      console.log("Wrong number of arguments.");
    } else if (nonIndex(answerArr[0]) || nonIndex(answerArr[1])) {
      console.log(
        "Invalid line or column. First and second arguments can accept only 0, 1 or 2."
      );
    } else {
      enter(answerArr[0], answerArr[1], answerArr[2]);
      if (inputCounter === 3) {
        console.log("Table complete");
        rl.close();
      } else {
        console.log(textPrompt + "\n");
      }
    }
  }
});
rl.on("close", () => {
  console.log("Closing");
});
