import fs from "fs";
import path from  "path";

export default async function handler(req, res) {
  const { index } = req.query;
  const rollNumbersPath = path.join(process.cwd(), "src/data/RollNumbers.json");
  const RollNumbers = JSON.parse(rollNumbersPath);

  if (req.method === "DELETE") {
    RollNumbers[index - 1] = null;
    fs.writeFileSync("./src/data/RollNumbers.json", JSON.stringify(RollNumbers));
    res.status(200).json("Deleted");
  } else if (req.method === "PUT") {
    const { rollNumber } = req.body;
    RollNumbers[index - 1] = rollNumber;
    fs.writeFileSync("./src/data/RollNumbers.json", JSON.stringify(RollNumbers));
    res.status(200).json("Updated");
  }
}
