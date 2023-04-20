import RollNumbers from "@/data/RollNumbers.js";

export default async function handler(req, res) {
  const { index } = req.query;

  if (req.method === "DELETE") {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
    RollNumbers[index - 1] = null;
    res.status(200).json("Deleted");
  } else if (req.method === "PUT") {
    const { rollNumber } = req.body;
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
    RollNumbers[index - 1] = rollNumber;
    res.status(200).json("Updated");
  }
}
