const request = require("supertest");
const app = require("../server"); // express app export yapılacak
const mongoose = require("mongoose");

beforeAll(async () => {
  // Test DB
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Service", () => {
  let testEmail = `test${Date.now()}@mail.com`;
//   yeni kullanıcı kaydı
  it("Yeni Kullanıcı Başarıyla Kayıt Olmalı", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: testEmail,
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("email", testEmail);
  });
// kayıt sırasında email kontrolü
  it("Aynı email ile tekrar kayıt engellenmeli", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: testEmail,
      password: "password123",
    });
    expect(res.statusCode).toBe(400);
  });
// giriş şifre kontrolü
  it("Giriş işlemi doğru şifre ile olmalı", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: testEmail,
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
