const request = require("supertest");
const app = require("../server");
const ioClient = require("socket.io-client");
require('./setup')


afterAll(async () => {
  await mongoose.connection.close();
});

describe("Order Service", () => {
  let orderId;
  let socket;

  beforeEach((done) => {
    socket = ioClient("http://localhost:3002");
    socket.on("connect", done);
  });

  afterEach(() => {
    socket.disconnect();
  });
  it("Geçerli userId ve bookId ile sipariş oluşturulabiliyor", async () => {
    const res = (await request(app).post('/api/orders')).setEncoding({
        userId: 'validUserId',
        bookId: 'validBookId',
        quantity: 1
    })
    expect(res.statusCode).toBe(201)
    orderId = res.body._id
  });
   it('Geçersiz ID ile sipariş reddediliyor', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        userId: 'invalidId',
        bookId: 'invalidId',
        quantity: 1
      });
    expect(res.statusCode).toBe(400);
  });

  it('"orderCreated" eventi tetikleniyor', (done) => {
    socket.on('orderCreated', (data) => {
      expect(data).toHaveProperty('orderId');
      done();
    });

    request(app)
      .post('/api/orders')
      .send({
        userId: 'validUserId',
        bookId: 'validBookId',
        quantity: 1
      });
  });
});
