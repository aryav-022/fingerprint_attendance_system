import jwt from "jsonwebtoken";
import User from "../../../../models/User";
import connectDB from "../../../../middleware/mongoose";

const handler = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "No body provided" });
    }
    
    const user = await User.findOne({ email });
    
    if (user) {
        return res.status(404).json({ message: "User already exists" });
    }
    
    const newUser = new User({ name, email, password });
    await newUser.save();
    
    return res.json({
        token: jwt.sign({ name, email, admin: false }, process.env.JWT_SECRET)
    })
}

export default connectDB(handler);