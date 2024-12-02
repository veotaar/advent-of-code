const file = await Deno.readTextFile("input.txt");
const rawReportsArray = file.split("\n").map((report) => report.split(" "));
const reportsArray = rawReportsArray.map((report) => report.map(Number));

const isSafe = (report: number[]): boolean => {
  let difference = report[1] - report[0];
  const increasing = difference > 0;

  if (difference === 0 || Math.abs(difference) > 3) return false;

  for (let i = 1; i < report.length - 1; i++) {
    difference = report[i + 1] - report[i];
    if (
      difference === 0 || increasing && difference < 0 ||
      !increasing && difference > 0
    ) return false;
    if (Math.abs(difference) > 3) return false;
  }

  return true;
};

const isTolerated = (report: number[]): boolean => {
  if (isSafe(report)) return true;

  let toleratedReport: number[];

  for (let i = 0; i < report.length; i++) {
    toleratedReport = report.toSpliced(i, 1);
    if (isSafe(toleratedReport)) return true;
  }

  return false;
};

const safetyArray = reportsArray.map((report) => isSafe(report));
const safeCount = safetyArray.filter((a) => a).length;

const toleratedSafetyArray = reportsArray.map((report) => isTolerated(report));
const toleratedSafeCount = toleratedSafetyArray.filter((a) => a).length;

// console.log(reportsArray);
console.log(safetyArray);
console.log(safeCount);
console.log(toleratedSafetyArray);
console.log(toleratedSafeCount);
