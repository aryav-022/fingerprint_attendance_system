import fs from "fs";

export default async function handler(req, res) {
  const RollNumbers = JSON.parse(fs.readFileSync("./src/data/RollNumbers.json"));
  if (req.method === "POST") {
    const { rollNumber } = req.body;
    const isPresent = RollNumbers.includes(rollNumber);
    if (isPresent) {
      res.status(409).json("Already Present");
    } else {
      const index = RollNumbers.findIndex(num => num === null);
      if (index >= 0) {
        RollNumbers[index] = rollNumber;
        fs.writeFileSync("./src/data/RollNumbers.json" , JSON.stringify(RollNumbers));
        res.status(200).json(index + 1);
      } else {
        res.status(507).json("RollNumbers array is full");
      }
    }
  } else {
    res.status(200).json(RollNumbers);
  }
}
