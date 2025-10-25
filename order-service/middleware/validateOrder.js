const mongoose = require("mongoose");
const { body, param, validationResult } = require("express-validator");

const createOrderRules = [
  body("userId")
    .exists()
    .withMessage("userId Gerekli")
    .bail()
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Geçersiz UserId"),
  body("bookId")
    .exists()
    .withMessage("bookId gerekli")
    .bail()
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Geçersiz BookId"),
  body("quantity")
    .exists()
    .withMessage("Quantity Gerekli")
    .isInt({ min: 1 })
    .withMessage("Quantity en az 1 olmalı"),
];
const validate = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({status: 'fail', errors: errors.array()})
    }
    next()
}
module.exports= {createOrderRules, validate}