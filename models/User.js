import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    subjects: [{
        email: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
    }]
});

export default mongoose.models.User || mongoose.model("User", UserSchema);