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
module.exports = app

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
