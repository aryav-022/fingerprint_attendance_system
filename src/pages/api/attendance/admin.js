import jwt from "jsonwebtoken";

export default function handler(req, res) {
    if (req.method === "POST") {
        const { token, date, student } = req.body;
        
        if (!token || token === "null" || token === "undefined") {
            return res.status(400).json({ message: "No token provided" });
        }

        if (!date) {
            return res.status(400).json({ message: "No date provided" });
        }

        if (!student) {
            return res.status(400).json({ message: "No student provided" });
        }

        try {
            if (!jwt.verify(token.substring(1, token.length - 1), process.env.JWT_SECRET)) {
                return res.status(401).json({ message: "Invalid token" });
            }

            const user = jwt.decode(token.substring(1, token.length - 1), process.env.JWT_SECRET);

            if (!user.admin) {
                return res.status(401).json({ message: "You are not authorized" });
            }

            const Admins = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/data/Admins.json"), "utf-8"));
            const subject = Admins[user.email][0][2];

            const attendancePath = path.join(process.cwd(), "src/data/Attendance.json");
            const Attendance = JSON.parse(fs.readFileSync(attendancePath, "utf-8"));

            Attendance[student].subjects[subject][date.replaceAll("/", "-")] = !Attendance[student].subjects[subject][date.replaceAll("/", "-")];

            fs.writeFileSync(attendancePath, JSON.stringify(Attendance));

            return res.status(200).json({ message: "Attendance updated" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}