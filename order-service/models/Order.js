const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    bookId:{type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true},
    quantity:{type: Number, required: true,min: [1, 'Quantity en az 1 olmalı']}
    
}, { timestamps: true })
module.exports = mongoose.model("Order", orderSchema)