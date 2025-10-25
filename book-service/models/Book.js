const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title gerekli'], trim: true },
  author: { type: String, required: [true, 'Author gerekli'], trim: true },
  price: { type: Number, required: [true, 'Price gerekli'], min: [0, 'Price negatif olamaz']},
  
}, { timestamps: true });
module.exports = mongoose.model("Book", bookSchema);
