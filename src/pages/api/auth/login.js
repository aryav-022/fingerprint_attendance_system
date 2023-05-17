import jwt from "jsonwebtoken";
import User from "../../../../models/User";
import connectDB from "../../../../middleware/mongoose";

const handler = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "No body provided" });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: "Incorrect password" });
    }

    return res.status(200).json({
        token: jwt.sign({ name: user.name, email, admin: user.admin }, process.env.JWT_SECRET)
    })
}

export default connectDB(handler);