const text = await Deno.readTextFile("input.txt");

// --- Part One ---
const array = [...text.matchAll(/mul\(\d{1,3},\d{1,3}\)/g)].map((arr) => arr[0])
  .map((mult) => [...mult.matchAll(/\d{1,3}/g)]).map(
    (arr) => [Number(arr[0][0]), Number(arr[1][0])],
  );
const mults = array.map((operation) => operation[0] * operation[1]);
const addedMults = mults.reduce((a, b) => a + b);

// console.log(array);
// console.log(mults);
console.log(addedMults);

// --- Part Two ---
const fullArray = [
  ...text.matchAll(/do\(\)|don\'t\(\)|mul\(\d{1,3},\d{1,3}\)/g),
].map((arr) => arr[0]);

const multiply = (instruction: string): number => {
  const match = instruction.match(/mul\(\d{1,3},\d{1,3}\)/g);
  if (!match) return 0;

  const nums = [...match[0].matchAll(/\d{1,3}/g)].map((arr) => Number(arr[0]));

  return nums[0] * nums[1];
};

const parse = (instructions: string[]) => {
  let enabled = true;
  const parsed: number[] = [];

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    if (instruction === "don't()") {
      enabled = false;
      continue;
    }

    if (instruction === "do()") {
      enabled = true;
      continue;
    }

    if (!enabled) continue;

    parsed.push(multiply(instruction));
  }

  return parsed;
};

const totalParsed = parse(fullArray).reduce((a, b) => a + b);

// console.log(fullArray);
// console.log(parse(fullArray));
console.log(totalParsed);
