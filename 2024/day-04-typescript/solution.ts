const input = await Deno.readTextFile("input.txt");
const grid = input.split("\n").map((row) => row.split(""));

const reverseString = (str: string) => [...str].reverse().join("");
const isFound = (search: string, compare: string) =>
  search === compare || search === reverseString(compare);

// --- Part One ---
const searchWord = (word: string, grid: string[][]) => {
  const wordIndexArray = Array.from(word, (_, k) => k);
  const gridCols = grid[0].length;
  const gridRows = grid.length;
  let wordCount = 0;

  // horizontal search ➡️⬅️
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col <= gridCols - word.length; col++) {
      const check: string[] = [];
      wordIndexArray.forEach((i) => {
        check.push(grid[row][col + i]);
      });
      if (isFound(word, check.join(""))) {
        wordCount += 1;
        console.log(`${check.join("")} %cFOUND!`, "color: green");
      } else {
        // console.log(`${check.join('')} %cNOPE`, "color: red");
      }
    }
  }

  // diagonal left-to-right search ↘️↖️
  for (let row = 0; row <= gridRows - word.length; row++) {
    for (let col = 0; col <= gridCols - word.length; col++) {
      const check: string[] = [];
      wordIndexArray.forEach((i) => {
        check.push(grid[row + i][col + i]);
      });
      if (isFound(word, check.join(""))) {
        wordCount += 1;
        console.log(`${check.join("")} %cFOUND!`, "color: green");
      } else {
        // console.log(`${check.join('')} %cNOPE`, "color: red");
      }
    }
  }

  // diagonal right-to-left search ↙️↗️
  for (let row = 0; row <= gridRows - word.length; row++) {
    for (let col = gridCols - 1; col >= word.length - 1; col--) {
      const check: string[] = [];
      wordIndexArray.forEach((i) => {
        check.push(grid[row + i][col - i]);
      });
      if (isFound(word, check.join(""))) {
        wordCount += 1;
        console.log(`${check.join("")} %cFOUND!`, "color: green");
      } else {
        // console.log(`${check.join('')} %cNOPE`, "color: red");
      }
    }
  }

  // vertical search ⬇️⬆️
  for (let row = 0; row <= gridRows - word.length; row++) {
    for (let col = 0; col < gridCols; col++) {
      const check: string[] = [];
      wordIndexArray.forEach((i) => {
        check.push(grid[row + i][col]);
      });
      if (isFound(word, check.join(""))) {
        wordCount += 1;
        console.log(`${check.join("")} %cFOUND!`, "color: green");
      } else {
        // console.log(`${check.join('')} %cNOPE`, "color: red");
      }
    }
  }

  console.log("total found: ", wordCount);
  return wordCount;
};

// --- Part Two ---
const searchCrossWord = (word: string, grid: string[][]) => {
  const wordIndexArray = Array.from(word, (_, k) => k);
  const wordReverseIndexArray = wordIndexArray.toReversed();
  const gridCols = grid[0].length;
  const gridRows = grid.length;
  let crossCount = 0;

  for (let row = 0; row <= gridRows - word.length; row++) {
    for (let col = 0; col <= gridCols - word.length; col++) {
      const first: string[] = [];
      const second: string[] = [];

      wordIndexArray.forEach((i) => {
        first.push(grid[row + i][col + i]);
      });

      wordReverseIndexArray.forEach((i) => {
        second.push(grid[row + i][col + word.length - i - 1]);
      });

      if (isFound(word, first.join("")) && isFound(word, second.join(""))) {
        crossCount += 1;
        console.log(
          `${first.join("")}-${second.join("")}: %cFOUND!`,
          "color: green",
        );
      } else {
        // console.log(`${first.join('')}-${second.join('')}: %cNOPE!`, "color: red");
      }
    }
  }

  console.log("total found: ", crossCount);
  return crossCount;
};

searchWord("XMAS", grid);
searchCrossWord("MAS", grid);
