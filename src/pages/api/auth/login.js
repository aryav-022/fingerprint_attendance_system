import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export default function handler(req, res) {
    if (!req.body) {
        return res.status(400).json({ message: "No body provided" });
    }

    const { email, password } = req.body;

    const usersPath = path.join(process.cwd(), "src/data/Users.json");
    const users = JSON.parse(fs.readFileSync(usersPath));
    const user = users.find((user) => user.email === email);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.password !== password) {
        return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({
        token: jwt.sign({ name: user.name, email, admin: user.admin }, process.env.JWT_SECRET)
    })
}