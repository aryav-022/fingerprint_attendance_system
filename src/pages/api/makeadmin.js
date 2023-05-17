import User from "../../../models/User";
import Admin from "../../../models/Admin";
import connectDB from "../../../middleware/mongoose";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    if (req.method === "POST") {
        const { token, code, subject } = req.body;
        
        if (!token || !code || !subject) {
            return res.status(400).json({ message: "No body provided" });
        }

        try {
            const { admin } = jwt.verify(token, process.env.JWT_SECRET);
                        
            if (!admin) {
                return res.status(401).json({ message: "You are not authorized" });
            }
            
            const user = await User.findOne({ email: code });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.admin = true;
            await user.save();

            const adminUserExist = await Admin.findOne({ email: user.email });

            if (adminUserExist) {
                return res.status(409).json({ message: "User is already an admin" });
            }

            const adminUser = new Admin({ email: user.email, name: user.name, subject });
            await adminUser.save();

            return res.status(200).json({ message: "User is now an admin" });
        } catch (err) {
            console.log(err);
            return res.status(401).json({ message: "Invalid token" });
        }
    }
}

export default connectDB(handler);