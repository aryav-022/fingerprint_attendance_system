import User from "../../../models/User";
import Admin from "../../../models/Admin";
import connectDB from "../../../middleware/mongoose";

const handler = async (req, res) => {
    if (req.method === "POST") {
        try {
            const { code, email, name } = req.body;
    
            if (!code || !email || !name) {
                return res.status(400).json({ message: "No body provided" });
            }
            
            const admin = await Admin.findOne({ email: code });
            
            if (!admin) {
                return res.status(404).json({ message: "Incorrect Code" });
            }
            
            admin.students.push(email);
            await admin.save();
            
            const user = await User.findOne({ email });
            user.subjects.push({ email: admin.email, subject: admin.subject });
            user.save();
    
            return res.status(200).json({ message: "Subject added" });
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export default connectDB(handler);