const input = await Deno.readTextFile("input.txt");

const obstacleGrid = input.split('\n').map(row => row.split('')).map(row => row.map(pos => pos === "#"));
const visitedGrid = input.split('\n').map(row => row.split('')).map(row => row.map(pos => pos === "^"));

let startingPosition = [0, 0];

// find starting position
for(let row=0; row < visitedGrid.length; row++){
  for(let col=0; col < visitedGrid.length; col++) {
    if(visitedGrid[row][col]) {
      startingPosition = [row, col];
    }
  }
}

type Position = {
  row: number;
  col: number
}

const traverse = (start: Position, obstacles: boolean[][], calculatePath: boolean) => {
  const visited = structuredClone(visitedGrid);
  const path: number[][] = [];

  // UP, RIGHT, DOWN, LEFT
  const directions = [[-1,0], [0,1], [1,0], [0,-1]]
  let currentDirection = 0;

  const stepLimit = 200;
  let stepsSinceNewPosition = 0;
  let exited = false;

  let position = start;

  const nextDirection = (cur: number) => cur + 1 === directions.length ? 0 : cur + 1;

  const nextPosition = (currentPos: Position) => {
    let nextRow = currentPos.row + directions[currentDirection][0];
    let nextCol = currentPos.col + directions[currentDirection][1];

    if(nextRow >= obstacles.length || nextCol >= obstacles.length || nextRow < 0 || nextCol < 0) {
      exited = true;
      return null;
    }

    if(!obstacles[nextRow][nextCol]) {
      return { row: nextRow, col: nextCol }
    }

    do {
      currentDirection = nextDirection(currentDirection);
      nextRow = currentPos.row + directions[currentDirection][0];
      nextCol = currentPos.col + directions[currentDirection][1];
    } while(obstacles[nextRow][nextCol])

    return { row: nextRow, col: nextCol }
  }

  while(nextPosition(position) && stepsSinceNewPosition < stepLimit) {
    position = nextPosition(position) as Position;
    if(visited[position.row][position.col]) {
      stepsSinceNewPosition += 1;
      continue;
    }
    visited[position.row][position.col] = true;
    if(calculatePath) {
      path.push([position.row, position.col]);
    }
    stepsSinceNewPosition = 0;
  }

  return {
    visitedCount: visited.map(row => row.filter(a => a).length).reduce((a, b) => a + b),
    exited,
    stuck: !exited,
    path
  }
}

const determineTimeLoopObstructionLocations = () => {
  let timeLoopsTotal = 0;
  const { path } = traverse({row: startingPosition[0], col: startingPosition[1]}, obstacleGrid, true);

  path.forEach((newObstacle) => {
    const newObstacleGrid = structuredClone(obstacleGrid);
    newObstacleGrid[newObstacle[0]][newObstacle[1]] = true;

    const surveyResult = traverse({row: startingPosition[0], col: startingPosition[1]}, newObstacleGrid, false);

    if(surveyResult.stuck) {
      timeLoopsTotal += 1;
      // console.log(`Stuck in a loop with added obstacle (${row},${col})!`)
    }
  })

  return timeLoopsTotal;
}

console.time("took");
const result = traverse({row: startingPosition[0], col: startingPosition[1]}, obstacleGrid, false);
const timeLoopObstaclePositionsTotal = determineTimeLoopObstructionLocations();
console.log('--- Part One ---');
console.table(result.visitedCount);
console.log('--- Part Two ---');
console.log(timeLoopObstaclePositionsTotal);
console.timeEnd("took");
