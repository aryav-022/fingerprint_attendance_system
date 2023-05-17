import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    subject: {
        type: String
    },
    students: {
        type: Array,
        default: []
    }
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);