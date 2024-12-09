const input = await Deno.readTextFile("input.txt");

console.time("took");

const data = input.split("\n").map((r) => r.split(""));

type Position = {
  x: number;
  y: number;
};

type AntiNode = {
  addedBy: {
    antenna: string;
    pair: Position[];
  };
};

const antennaMap = new Map<string, Position[]>();
const antiNodesMap = new Map<string, AntiNode[]>();

const antennaPositionMap = new Map<string, string>();

// create antenna map
for (let row = 0; row < data.length; row++) {
  for (let col = 0; col < data[0].length; col++) {
    const el = data[row][col];
    if (el === ".") continue;

    antennaPositionMap.set(`${row}-${col}`, el);

    if (antennaMap.has(el)) {
      const existing = antennaMap.get(el) as Position[];
      antennaMap.set(el, [...existing, { x: row, y: col }]);
    } else {
      antennaMap.set(el, [{ x: row, y: col }]);
    }
  }
}

const generatePairs = <T>(arr: T[]) => {
  const pairs = [];

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }

  return pairs;
};

const addAntiNode = (a: Position, b: Position, antenna: string) => {
  const xDistance = b.x - a.x;
  const yDistance = b.y - a.y;
  const newNodes = [];

  for (let i = 1; i < 50; i++) {
    newNodes.push(
      {
        x: a.x - i * xDistance,
        y: a.y - i * yDistance,
      },
      {
        x: b.x + i * xDistance,
        y: b.y + i * yDistance,
      },
    );
  }

  for (const node of newNodes) {
    if (
      node.x < 0 || node.x >= data.length || node.y < 0 || node.y >= data.length
    ) {
      continue;
    }

    if (antiNodesMap.has(`${node.x}-${node.y}`)) {
      const existing = antiNodesMap.get(`${node.x}-${node.y}`) as AntiNode[];
      antiNodesMap.set(`${node.x}-${node.y}`, [...existing, {
        addedBy: {
          antenna: antenna,
          pair: [a, b],
        },
      }]);
    } else {
      antiNodesMap.set(`${node.x}-${node.y}`, [{
        addedBy: {
          antenna: antenna,
          pair: [a, b],
        },
      }]);
    }
  }
};

// create antinodes
for (const [key, value] of antennaMap) {
  const pairs = generatePairs(value);

  for (const pair of pairs) {
    addAntiNode(pair[0], pair[1], key);
  }
}

// print final map in "result.txt"
let total = 0;
const rowStringArr: string[] = [];
for (let i = 0; i < data.length; i++) {
  const rowString = [];
  for (let j = 0; j < data.length; j++) {
    if (antennaPositionMap.has(`${i}-${j}`)) {
      const antenna = antennaPositionMap.get(`${i}-${j}`);
      rowString.push(antenna);
      total += 1;
    } else if (antiNodesMap.has(`${i}-${j}`)) {
      rowString.push("#");
      total += 1;
    } else {
      rowString.push(".");
    }
  }
  rowStringArr.push(rowString.join(""));
}

const encoder = new TextEncoder();

for await (const row of rowStringArr) {
  const rowData = encoder.encode(`${row}\n`);
  await Deno.writeFile("result.txt", rowData, { append: true });
}

console.log(total);
console.timeEnd("took");
