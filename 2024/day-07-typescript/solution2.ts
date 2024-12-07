const input = await Deno.readTextFile("input.txt");

const data = new Map(
  input.split("\n").map((d) => d.split(":")).map((data) => {
    const testValue = Number(data[0]);
    const equation = data[1].trim().split(" ").map(Number);

    return [testValue, equation];
  }),
);

const isValid = (target: number, values: number[]) => {
  if (values.length === 2) {
    return Number(values.join("")) === target ||
      values[0] * values[1] === target ||
      values[0] + values[1] === target;
  }

  const lastValue = values.at(-1) as number;
  const others = values.slice(0, -1);

  const correctMultTarget = target / lastValue;
  const correctSumTarget = target - lastValue;
  const correctPipeTarget = Number(
    String(target).slice(0, -String(lastValue).length),
  );

  if (
    correctMultTarget === Math.floor(correctMultTarget) &&
    isValid(correctMultTarget, others)
  ) return true;
  if (correctSumTarget > 0 && isValid(correctSumTarget, others)) return true;
  if (
    String(target).endsWith(String(lastValue)) &&
    isValid(correctPipeTarget, others)
  ) return true;

  return false;
};

const calibratedEqs = () => {
  let totalCalibrated = 0;

  for (const [key, value] of data) {
    if (isValid(key, value)) {
      totalCalibrated += key;
    }
  }

  return totalCalibrated;
};

const calibrated = calibratedEqs();
console.log(calibrated);
