const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bookRoutes = require("./routes/book.routes");

dotenv.config();
const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("book service is ok");
});

// Test ortamında mongoose.connect’i atla
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
}
const PORT = process.env.PORT || 3000;
module.exports = app

if (require.main === module && process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
