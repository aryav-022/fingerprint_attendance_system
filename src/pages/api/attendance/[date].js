import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const attendancePath = path.join(process.cwd(), "src/data/Attendance.json");
    const attendance = JSON.parse(fs.readFileSync(attendancePath));
    let { date } = req.query;
    date = date.replaceAll("-", "/");
    const dateAttendance = attendance[date];
    res.status(200).json({
        date,
        present: dateAttendance
    });
}