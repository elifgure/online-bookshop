const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const orderRoutes = require("./routes/order.routes");

dotenv.config();

const app = express();

// middleware
app.use(express.json());
// routes
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Order service ok");
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
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
