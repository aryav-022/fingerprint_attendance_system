import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const rollNumbersPath = path.join(process.cwd(), "src/data/RollNumbers.json");
    const RollNumbers = JSON.parse(fs.readFileSync(rollNumbersPath));
    const attendancePath = path.join(process.cwd(), "src/data/Attendance.json");
    const attendance = JSON.parse(fs.readFileSync(attendancePath));
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