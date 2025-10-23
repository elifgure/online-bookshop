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

// mongoose connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const PORT = process.env.PORT || 3001;
module.exports = app

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
