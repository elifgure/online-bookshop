const request = require("supertest");
const app = require("../server"); 
require('./setup');

jest.setTimeout(30000); // 30 saniye

describe("User Service", () => {
  let testEmail;

  beforeEach(() => {
    testEmail = `test${Date.now()}@mail.com`; // Her test için benzersiz email
  });

  it("Yeni Kullanıcı Başarıyla Kayıt Olmalı", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: testEmail,
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", testEmail);
  });

  it("Aynı email ile tekrar kayıt engellenmeli", async () => {
    // Önce kullanıcıyı ekle
    await request(app).post("/api/users/register").send({
      name: "Test User",
      email: testEmail,
      password: "password123",
    });

    // Aynı email ile tekrar eklemeye çalış
    const res = await request(app).post("/api/users/register").send({
      name: "Test User 2",
      email: testEmail,
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
  });

  it("Giriş işlemi doğru şifre ile olmalı", async () => {
    // Önce kullanıcıyı ekle
    await request(app).post("/api/users/register").send({
      name: "Test User",
      email: testEmail,
      password: "password123",
    });

    const res = await request(app).post("/api/users/login").send({
      email: testEmail,
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
