const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user.routes");

dotenv.config();
const app = express();

// middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("user service ok");
});
// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: err.message || "Something went wrong!",
  });
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
