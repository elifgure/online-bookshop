const express = require("express")
const router = express.Router()
const bookController = require("../controllers/book.controller")

router.post("/", bookController.addBook)
router.get("/", bookController.getBooks)
router.get("/:id", bookController.getBooksbyId)

module.exports = router;