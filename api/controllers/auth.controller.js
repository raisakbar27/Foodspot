import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";


export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    try {
        await newUser.save();
        res.status(201).json("User created successfully");

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => { 
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "User not found"));
        const isPasswordValid = bcrypt.compareSync(password, validUser.password);
        if (!isPasswordValid) return next(errorHandler(401, "Invalid password"));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 86400000) })
            .status(200)
            .json(rest); 

    } catch (error) {
        next(error);
    }
}