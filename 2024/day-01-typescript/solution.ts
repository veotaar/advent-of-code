const file = await Deno.readTextFile("input.txt");
const sampleArray = file.split("\n");

const leftArray = [];
const rightArray = [];
const distanceArray = [];
const similarityArray = [];

for await (const item of sampleArray) {
  const items = item.split("   ");
  leftArray.push(Number(items[0]));
  rightArray.push(Number(items[1]));
}

const leftNumbers = leftArray.toSorted();
const rightNumbers = rightArray.toSorted();

for (let i = 0; i < sampleArray.length; i++) {
  const dist = Math.abs(leftNumbers[i] - rightNumbers[i]);
  distanceArray.push(dist);
}

for (let i = 0; i < leftNumbers.length; i++) {
  const similarity = rightNumbers.filter((search) =>
    search === leftNumbers[i]
  ).length;
  similarityArray.push(leftNumbers[i] * similarity);
}

const totalDistance = distanceArray.reduce((a, b) => a + b);
const totalSimilarity = similarityArray.reduce((a, b) => a + b);

console.log("total distance: ", totalDistance);
console.log("total similarity: ", totalSimilarity);
