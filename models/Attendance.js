import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    students: {
        type: Array,
        default: []
    }
});

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);