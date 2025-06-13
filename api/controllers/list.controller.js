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

export const getLists = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    // Handle type multiple values
    let type = req.query.type;
    let typeFilter;
    if (!type || type === 'all') {
      typeFilter = { $exists: true }; // semua type
    } else {
      // split jadi array, trim spasi
      const typeArray = type.split(',').map(t => t.trim());
      typeFilter = { $in: typeArray };
    }

    // Harga filter
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

    // Rating filter
    const minRating = parseFloat(req.query.minRating) || 0;

    // Search di name dan description sekaligus dengan regex case insensitive
    const regex = { $regex: searchTerm, $options: 'i' };

    const lists = await List.find({
      type: typeFilter,
      price: { $gte: minPrice, $lte: maxPrice },
      rating: { $gte: minRating },
      $or: [
        { name: regex },
        { description: regex }
      ]
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(lists);
    } catch (error) {
        next(error);
    }
}