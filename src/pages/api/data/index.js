import RollNumbers from "@/data/RollNumbers.js";
import { Mutex } from 'async-mutex';

// Create a mutex for the RollNumbers array
const mutex = new Mutex();

// Handler 1
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { rollNumber } = req.body;
    const isPresent = RollNumbers.includes(rollNumber);
    if (isPresent) {
      res.status(200).json("Already Present");
    } else {
      // Acquire the mutex to modify the RollNumbers array
      const release = await mutex.acquire();
      try {
        const index = RollNumbers.findIndex((num) => num === null);
        if (index >= 0) {
          RollNumbers[index] = rollNumber;
          res.status(200).json(index + 1);
        } else {
          res.status(500).json("RollNumbers array is full");
        }
      } finally {
        // Release the mutex to allow other handlers to modify the RollNumbers array
        release();
      }
    }
  } else {
    res.status(200).json(RollNumbers);
  }
}
