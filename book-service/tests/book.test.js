const request = require('supertest');
const app = require('../server');
require('dotenv').config();
require('./setup')

jest.setTimeout(30000); // 30 saniye

describe('Book Service', () => {
  let bookId;

  it('Kitap ekleme ve listeleme başarılı olmalı', async () => {
    // 1. Kitap ekle
    const addRes = await request(app)
      .post('/api/books')
      .send({ title: 'Test Book', author: 'Author', price: 20 });

    expect(addRes.statusCode).toBe(201);
    bookId = addRes.body.book._id;

    // 2. Kitap listesi al
    const listRes = await request(app).get('/api/books');
    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body.data)).toBe(true);
    expect(listRes.body.data.length).toBeGreaterThan(0);
  });
});
