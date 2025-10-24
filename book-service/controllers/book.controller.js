const Book = require("../models/Book");

// kitap ekleme fonksiyonu
exports.addBook = async (req, res) => {
  try {
    const { title, author, price } = req.body;
    if (!title || !author || !price) {
      return res.status(400).json({
        status: "fail",
        message: "Title, author ve price alanları zorunludur",
      });
    }
    const book = await Book.create({
      title,
      author,
      price,
    });
    res.status(201).json({
      status: "success",
      book,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
// kitap listeleme fonksiyonu
exports.getBooks = async (req, res)=>{
    try {
        const books = await Book.find()
        res.status(200).json({
            status:'success',
            data: books
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}
// tek kitap getirme fonksiyonu
exports.getBooksbyId = async (req, res)=>{
    try {
        const book = await Book.findById(req.params.id)
          if (!book) {
      return res.status(404).json({
        status: 'fail',
        message: 'Book not found'
      });
    }
    res.status(201).json({
        status:'success',
        data:book
    })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}