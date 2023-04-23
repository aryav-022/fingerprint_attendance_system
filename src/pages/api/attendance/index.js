import fs from "fs";

export default function handler(req, res) {
    const RollNumbers = JSON.parse(fs.readFileSync("./src/data/RollNumbers.json"));
    const attendance = JSON.parse(fs.readFileSync("./src/data/Attendance.json"));
    if (req.method === "POST") {
        const { id } = req.body;
        const rollNumber = RollNumbers[parseInt(id) - 1];
        if (rollNumber == null) return res.status(400).json("Invalid Id");
        else {
            const date = new Date().toLocaleDateString();
            if (!(date in attendance)) attendance[date] = [];
            if (attendance[date].includes(rollNumber)) {
                res.status(200).json("Attendance Already Marked");
            } else {
                attendance[date].push(rollNumber);
                fs.writeFileSync("./src/data/attendance.json", JSON.stringify(attendance));
                res.status(200).json("Attendance Marked");
            }
        }
    } else {
        res.status(200).json(attendance);
    }
}