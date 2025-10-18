const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
});
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