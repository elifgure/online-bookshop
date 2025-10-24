const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const orderRoutes = require("./routes/order.routes");
const { Server } = require("socket.io");

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(express.static("public"))

// HTTP server oluştur
const server = http.createServer(app);

// Socket.IO server'ı başlat
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.getIo = () => io;
// Socket.io bağlantısı
io.on("connection", (socket) => {
  console.log("Yeni bir istemci bağlandı", socket.id);

  socket.on("disconnect", () => {
    console.log("İstemci ayrıldı", socket.id);
  });
});
// io export
app.set("io", io)
// routes
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Order service ok");
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

