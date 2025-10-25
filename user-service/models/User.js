const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name gerekli'], trim: true, unique: true },
  email: { type: String,  required: [true, 'Email gerekli'], unique: true, lowercase: true, match: [/.+@.+\..+/, 'Geçersiz e-posta adresi'] },
  password: { type: String, required: [true, 'Şifre Gerekli'], minlength:[6, 'Şifre en az 6 karakterli olmalı'] },
}, { timestamps: true });
userSchema.index({ email: 1 }, { unique: true });
// şifre hashleme
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = function(candidate){
    return bcrypt.compare(candidate, this.password)

}

module.exports= mongoose.model("User", userSchema)