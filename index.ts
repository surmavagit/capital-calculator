import { define, calculate, Table } from "./calculations";

let matrix: Table = [
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
];

let inputCounter = 0;

const reset = () => {
  matrix = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ];
  inputCounter = 0;
  console.log("The table is reset");
};

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
