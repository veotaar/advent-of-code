const input = await Deno.readTextFile("input.txt");

const data = new Map(input.split('\n').map(d => d.split(':')).map(data => {
  const testValue = Number(data[0]);
  const equation = data[1].trim().split(' ').map(Number);

  return [testValue, equation]
}))

const analysis = new Map<number, number>();
const operationsLookupTable = new Map<number, string[][]>();

const getVariations = (pool: string[], length: number) => {
  const first = pool.map(s => [s]);
  let loop = 0;

  if(length <= 1) return first;

  const addVariation = (combination: string[][]) => {
    if(combination[0].length === length) return combination;

    const result: string[][] = [];

    pool.forEach(choice => {
      combination.forEach(arr => {
        result.push([choice, ...arr]);
        loop += 1;
      })
    })

    return addVariation(result);
  }

  return addVariation(first);
}

for(const values of data.values()) {
  const operations = values.length - 1;
  if (analysis.has(operations)) {
    const count = analysis.get(operations) as number;
    analysis.set(operations, count + 1)
  } else {
    analysis.set(operations, 1);
    operationsLookupTable.set(operations, getVariations(["+", "*", "||"], operations))
  }
}

const calibratedEqs = () => {
  let totalCalibrated = 0;

  for(const [key, value] of data){
    const operations = operationsLookupTable.get(value.length - 1) as string[][];

    for(const operation of operations) {
      const target = value.reduce((a, b, i) => {
        if(operation[i - 1] === "+") {
          return a + b;
        } else if (operation[i - 1] === "*") {
          return a * b;
        }
        return Number(`${String(a)}${String(b)}`);
      })
      if (target === key) {
        totalCalibrated += target;
        break;
      }
    }
  }

  return totalCalibrated;
}

const calibrated = calibratedEqs();
console.log(calibrated);
