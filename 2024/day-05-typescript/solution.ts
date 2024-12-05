const input = await Deno.readTextFile("input.txt");

const rules = input.split("\n");
const updates = rules.splice(rules.findIndex((r) => r === "")).slice(1).map(
  (u) => u.split(",").map(Number),
);

const compare = (a: number, b: number) => {
  const possibleRules = [`${a}|${b}`, `${b}|${a}`];

  if (rules.includes(possibleRules[0])) {
    return -1;
  } else if (rules.includes(possibleRules[1])) {
    return 1;
  }

  return 0;
};

const solve = (updates: number[][]) => {
  let correctSum = 0;
  let correctedSum = 0;

  updates.forEach((update) => {
    const sorted = update.toSorted(compare);
    if (update.toString() === sorted.toString()) {
      correctSum += sorted[Math.floor(sorted.length / 2)];
    } else {
      correctedSum += sorted[Math.floor(sorted.length / 2)];
    }
  });

  return {
    correctSum,
    correctedSum,
  };
};

console.table(solve(updates));
