import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avatar: {
        type: String,
        default: "https://fisika.uad.ac.id/wp-content/uploads/blank-profile-picture-973460_1280.png"
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
