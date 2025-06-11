import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    open: {
        type: Boolean,
        required: true
    },
    imageUrls: {
        type: Array,
        required: true
    },
    userRef: {
        type: String,
        required: true
    },
}, {timestamps: true}
);

const List = mongoose.model('List', listSchema);

export default List;