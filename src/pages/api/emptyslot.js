import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const rollNumbersPath = path.join(process.cwd(), "src/data/RollNumbers.json");
  const RollNumbers = JSON.parse(fs.readFileSync(rollNumbersPath));
  const index = RollNumbers.findIndex((rollNumber) => rollNumber === null);
  if (index !== -1) {
    return res.status(200).json(index + 1);
  } else {
    return res.status(404).json(-1);
  }
}