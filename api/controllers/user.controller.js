import bcrypt from "bcryptjs";
import User from '../models/user.model.js';
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
    res.json({
        message: 'Welcome to the User API',
        status: 'success',
    });
} 

export const updateUser = async (req, res, next) => {
    
    if (req.user.id !== req.params.id) return next(errorHandler(401, "you can only update your ow account"))
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 8)
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true })
        const { password, ...rest } = updateUser._doc
        
        res.status(200).json(rest);
    } catch (error) {
        next(error)
        
    }
}