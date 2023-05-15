import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export default function handler(req, res) {
    if (!req.body) {
        return res.status(400).json({ message: "No body provided" });
    }

    const { name, email, password } = req.body;
    
    const usersPath = path.join(process.cwd(), "src/data/Users.json");
    const users = JSON.parse(fs.readFileSync(usersPath));
    const user = users.find((user) => user.email === email);
    if (user) {
        return res.status(404).json({ message: "User already exists" });
    }
    
    users.push({ name, email, password, admin: false });
    
    fs.writeFileSync(usersPath, JSON.stringify(users));

    const attendancePath = path.join(process.cwd(), "src/data/Attendance.json");
    const Attendance = JSON.parse(fs.readFileSync(attendancePath));

    Attendance[email] = {
        from: "2023-05-14",
        to: "2023-07-28",
        subjects: {}
    }

    fs.writeFileSync(attendancePath, JSON.stringify(Attendance));

    return res.json({
        token: jwt.sign({ name, email }, process.env.JWT_SECRET)
    })
}