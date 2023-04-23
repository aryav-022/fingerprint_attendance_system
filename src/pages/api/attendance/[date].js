import fs from "fs";

export default function handler(req, res) {
    const attendance = JSON.parse(fs.readFileSync("./src/data/Attendance.json"));
    let { date } = req.query;
    date = date.replaceAll("-", "/");
    const dateAttendance = attendance[date];
    res.status(200).json({
        date,
        present: dateAttendance
    });
}