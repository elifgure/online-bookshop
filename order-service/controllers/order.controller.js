const axios = require("axios");
const Order = require("../models/Order");

// yeni sipariş oluşturma
exports.createOrder = async (req, res) => {
  try {
    const { userId, bookId, quantity } = req.body;
    // kullanıcı kontrolü
    const userResponse = await axios.get(
      `http://localhost:3000/users/${userId}`
    );
    if (!userResponse.data) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }
    // kitap kontrolü
    const bookResponse = await axios.get(
      `http://localhost:3001/books/${bookId}`
    );
    if (!bookResponse.data) {
      return res.status(400).json({ message: "Kitap bulunamadı" });
    }
    // sipariş oluşturma
    const order = new Order({ userId, bookId, quantity });
    await order.save();
    return res.status(201).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({
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
      `http://localhost:3000/users/${order.userId}`
    );
    // kitap bilgisi
    const bookResponse = await axios.get(
      `http://localhost:3001/books/${order.bookId}`
    );
    const orderDetails = {
      orderId: order._id,
      quantity: order.quantity,
      user: {
        id: userResponse.data._id,
        name: userResponse.data.name,
        email: userResponse.data.email,
      },
      book: {
        id: bookResponse.data._id,
        title: bookResponse.data.title,
        price: bookResponse.data.price,
      },
    };
    return res.status(200).json(orderDetails);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Sipariş detayı alınırken hata oluştu" });
  }
};
