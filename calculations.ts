type TabEntry = number | undefined;
type TabRow = [TabEntry, TabEntry, TabEntry];
export type Table = [TabRow, TabRow, TabRow];

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

export { define, calculate };
