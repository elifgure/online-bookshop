const request = require("supertest");
const app = require("../server");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");
 const mongoose = require("mongoose");
const axios = require("axios");
require('dotenv').config();
jest.setTimeout(60000); // 60 saniye


require("./setup");

// axios mock
jest.mock("axios");

describe("Order Service", () => {
  let userId;
  let bookId;
  let token;

  // dummy user ve book data


const dummyUser = { _id: new mongoose.Types.ObjectId(), name: "Test User", email: "test@mail.com" };
const dummyBook = { _id: new mongoose.Types.ObjectId(), title: "Test Book", price: 20 };


  beforeAll(() => {
    // JWT token üret
    token = jwt.sign({ id: dummyUser._id, email: dummyUser.email }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    userId = dummyUser._id;
    bookId = dummyBook._id;

    const mockEmit = jest.fn();
  app.set("io", { emit: mockEmit }); // req.app.get("io") bunu dönecek
  app.mockEmit = mockEmit; // testte erişebilmek için saklıyoruz
  });

  afterEach(async () => {
    // orderları temizle
    await Order.deleteMany();
  });

  it("Geçerli userId ve bookId ile sipariş oluşturulabiliyor", async () => {
    // axios mock
    axios.get.mockImplementation((url) => {
      if (url.includes("user-service")) return Promise.resolve({ data: dummyUser });
      if (url.includes("book-service")) return Promise.resolve({ data: { data: dummyBook } });
    });

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId,
        bookId,
        quantity: 1,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });

  it("Geçersiz ID ile sipariş reddediliyor", async () => {
    axios.get.mockRejectedValue(new Error("Not found"));

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: "invalidUser",
        bookId: "invalidBook",
        quantity: 1,
      });

    expect(res.statusCode).toBe(400);
  });

  it('"orderCreated" eventi tetikleniyor', async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("user-service")) return Promise.resolve({ data: dummyUser });
    if (url.includes("book-service")) return Promise.resolve({ data: { data: dummyBook } });
  });

  const res = await request(app)
    .post("/api/orders")
    .set("Authorization", `Bearer ${token}`)
    .send({
      userId,
      bookId,
      quantity: 1,
    });

  expect(res.statusCode).toBe(201);
  expect(app.mockEmit).toHaveBeenCalledWith(
  "orderCreated",
  expect.objectContaining({
    userId: userId.toString(),
    bookId: bookId.toString(),
    quantity: 1,
  })
);

// OrderId için ayrı bir doğrulama yap
const emittedData = app.mockEmit.mock.calls[0][1];
expect(emittedData.orderId).toBeDefined();
expect(typeof emittedData.orderId).toBe("string");
});

});
