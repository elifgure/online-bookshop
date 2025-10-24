// const axios = require("axios");
// const Order = require("../models/Order");
const dotenv = require("dotenv");

dotenv.config();

// yeni sipariş oluşturma
const axios = require("axios");
const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  const { userId, bookId, quantity } = req.body || {};
  // Eğer body eksikse hata dön
  if (!userId || !bookId || !quantity) {
    return res
      .status(400)
      .json({ message: "userId, bookId ve quantity gerekli" });
  }
  try {
    // kullanıcı kontrolü
    const userResponse = await axios.get(
      `http://user-service:3000/api/users/${userId}`,
      { headers: { Authorization: `Bearer ${process.env.USER_SERVICE_TOKEN}` } }
    );
    if (!userResponse.data) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }

    // kitap kontrolü
    const bookResponse = await axios.get(
      `http://book-service:3001/api/books/${bookId}`
    );
    if (!bookResponse.data) {
      return res.status(400).json({ message: "Kitap bulunamadı" });
    }

    // sipariş oluşturma
    const order = new Order({ userId, bookId, quantity });
    await order.save();
    // socket io ile event
    const io = req.app.get("io");
    io.emit("orderCreated", {
      orderId: order._id.toString(),
      userId: userId.toString(),
      bookId: bookId.toString(),
      quantity,
    });
    console.log("Sipariş oluşturuldu:", order._id);
    return res.status(201).json(order);
  } catch (error) {
    console.error("HATA:", error.message);
    return res.status(400).json({
      message: "Sipariş oluşturulurken bir hata oluştu",
      error: error.message,
    });
  }
};

// sipariş detayı alma
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    // kullanıcı bilgisi
    const userResponse = await axios.get(
      `http://user-service:3000/api/users/${order.userId}`,
      { headers: { Authorization: `Bearer ${process.env.USER_SERVICE_TOKEN}` } }
    );

    // kitap bilgisi
    const bookResponse = await axios.get(
      `http://book-service:3001/api/books/${order.bookId}`
    );

    // userResponse ve bookResponse yapısına göre düzeltme
    const userData = userResponse.data.user || {};
    const bookData = bookResponse.data.data || {};

    const orderDetails = {
      orderId: order._id,
      quantity: order.quantity,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      },
      book: {
        id: bookData.id,
        title: bookData.title,
        price: bookData.price,
      },
    };

    return res.status(200).json(orderDetails);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Sipariş detayı alınırken hata oluştu",
      error: error.message,
    });
  }
};
