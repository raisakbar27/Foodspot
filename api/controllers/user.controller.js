import bcrypt from "bcryptjs";
import User from '../models/user.model.js';
import { errorHandler } from "../utils/error.js";
import List from "../models/list.model.js";

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
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "you can only delete your ow account"))
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json('User has been deleted')
    } catch (error) {
        next(error)
    }
}

export const getUserList = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const list = await List.find({ userRef: req.params.id });
            res.status(200).json(list);
        } catch (error) {
            next(error)
        }
    } else {
        return next(errorHandler(401, "you can only see your ow account"));
    }
};