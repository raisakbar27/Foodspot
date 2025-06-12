import List from "../models/list.model.js";
import { errorHandler } from '../utils/error.js';


export const createList = async (req, res, next) => {
    try {
        const list = await List.create(req.body);
        return res.status(201).json(list);

    } catch (error) {
        next(error);
    }
}

export const deleteList = async (req, res, next) => {
    const list = await List.findById(req.params.id);
    if (!list) {
        return next(errorHandler(404, "List not found"));
    }
    if (req.user.id !== list.userRef) {
        return next(errorHandler(401, "You can only delete your own list"));
    }
    try {
        await List.findByIdAndDelete(req.params.id);
        res.status(200).json("List has been deleted");
    } catch (error) {
        next(error);
    }
}

export const updateList = async (req, res, next) => {
    const list = await List.findById(req.params.id);
    if (!list) {
        return next(errorHandler(404, "List not found"));
    }
    if (req.user.id !== list.userRef) {
        return next(errorHandler(401, "You can only update your own list"));
    }
    try {
        const updatedList = await List.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedList);
    } catch (error) {
        next(error);
    }
}

export const getList = async (req, res, next) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) {
            return next(errorHandler(404, "List not found"));
        }
        res.status(200).json(list);
    } catch (error) {
        next(error);
    }
}