import RollNumbers from "@/data/RollNumbers";

export default function handler(req, res) {
    RollNumbers.forEach((rollNumber, index) => {
        if (rollNumber === null) res.status(200).json(index+1);
    });
}