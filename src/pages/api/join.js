import fs from "fs";
import path from "path";

export default function handler(req, res) {
    if (req.method === "POST") {
        const { code, email, name } = req.body;

        const AdminPath = path.join(process.cwd(), "src/data/Admins.json");
        const Admins = JSON.parse(fs.readFileSync(AdminPath));

        if (code in Admins) {
            for (let i = 1; i < Admins[code].length; i++) {
                if (Admins[code][i][1] === email) {
                    return res.status(400).json("Already Present");
                }
            }

            Admins[code].push([name, email]);
            fs.writeFileSync(AdminPath, JSON.stringify(Admins));

            const subject = Admins[code][0][2];

            const AttendancePath = path.join(process.cwd(), "src/data/Attendance.json");
            const Attendance = JSON.parse(fs.readFileSync(AttendancePath));

            Attendance[email].subjects[subject] = {};

            fs.writeFileSync(AttendancePath, JSON.stringify(Attendance));

            return res.status(200).json("Added");
        }
        else {
            return res.status(400).json("Invalid Code");
        }
    }
}