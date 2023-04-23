import fs from "fs";

export default function handler(req, res) {
    const RollNumbers = JSON.parse(fs.readFileSync("./src/data/RollNumbers.json"));
    const index = RollNumbers.findIndex((rollNumber) => rollNumber === null);
    if (index !== -1) {
      return res.status(200).json(index + 1);
    } else {
      return res.status(404).json(-1);
    }
}  