import connectDb from "../../../middleware/mongoose";
import Attendance from "../../../models/Attendance";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    if (req.method === "POST") {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ message: "No body provided" });
            }

            const { email, admin } = jwt.verify(token, process.env.JWT_SECRET);

            if (!admin) {
                return res.status(401).json({ message: "You are not authorized" });
            }

            const attendance = new Attendance({ subject: email, date: new Date().toLocaleDateString('en-GB') });
            await attendance.save();

            return res.status(200).json({ message: "Attendance created" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export default connectDb(handler);