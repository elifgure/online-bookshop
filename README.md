# Online Bookshop - Microservices Projesi

Bu proje, mikroservis mimarisi kullanılarak geliştirilmiş online kitap satış platformudur. Node.js, Express.js, MongoDB ve Socket.IO teknolojileri kullanılarak oluşturulmuştur.

## 🏗️ Proje Yapısı

```
online-bookshop/
├── user-service/          # Kullanıcı yönetim servisi
├── book-service/          # Kitap yönetim servisi  
├── order-service/         # Sipariş yönetim servisi
├── docker-compose.yml     # Docker Compose konfigürasyonu
└── README.md             # Bu dosya
```

## 🚀 Servisler ve Portları

### 1. User Service (Port: 3000)
- **Amaç**: Kullanıcı kaydı, girişi ve JWT token yönetimi
- **Endpoint'ler**:
  - `POST /api/users/register` - Kullanıcı kaydı
  - `POST /api/users/login` - Kullanıcı girişi
  - `GET /api/users/:id` - Kullanıcı bilgisi alma (korumalı)

### 2. Book Service (Port: 3001)  
- **Amaç**: Kitap ekleme, listeleme ve detay görüntüleme
- **Endpoint'ler**:
  - `POST /api/books` - Kitap ekleme
  - `GET /api/books` - Tüm kitapları listeleme
  - `GET /api/books/:id` - Kitap detayı

### 3. Order Service (Port: 3002)
- **Amaç**: Sipariş oluşturma ve WebSocket ile real-time bildirimler
- **Endpoint'ler**:
  - `POST /api/orders` - Yeni sipariş oluşturma
  - `GET /api/orders/:id` - Sipariş detayı
- **WebSocket Events**:
  - `orderCreated` - Sipariş oluşturulduğunda emit edilir
  - `connection` - İstemci bağlandığında
  - `disconnect` - İstemci ayrıldığında

## 📋 Gereksinimler

- **Node.js** (v18 veya üstü)
- **npm** veya **yarn**
- **Docker** ve **Docker Compose**
- **MongoDB** (Atlas veya local)

## 🔧 Kurulum ve Çalıştırma

### Yöntem 1: Docker ile Çalıştırma (Önerilen)

#### 1. Projeyi İndirin
```bash
git clone https://github.com/elifgure/online-bookshop.git
cd online-bookshop
```

#### 2. Environment Dosyalarını Oluşturun

**user-service/.env:**
```env
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d
MONGO_URI=mongodb+srv://your_mongodb_connection_string
```

**book-service/.env:**
```env
PORT=3001
MONGO_URI=mongodb+srv://your_mongodb_connection_string
```

**order-service/.env:**
```env
PORT=3002
MONGO_URI=mongodb+srv://your_mongodb_connection_string
USER_SERVICE_TOKEN=your_service_token_here
```

#### 3. Docker Compose ile Başlatın
```bash
# Tüm servisleri build edip başlat
docker-compose up --build

# Arka planda çalıştırma
docker-compose up -d --build

# Logları görüntüleme  
docker-compose logs -f

# Servisleri durdurma
docker-compose down
```

### Yöntem 2: Manuel Kurulum

#### 1. Her servisi ayrı ayrı kurun
```bash
# User Service
cd user-service
npm install
npm start

# Book Service (yeni terminal)
cd ../book-service  
npm install
npm start

# Order Service (yeni terminal)
cd ../order-service
npm install  
npm start
```

## 🧪 Test Çalıştırma

### Tüm Servislerin Testlerini Çalıştırma

```bash
# User Service Testleri
cd user-service
npm test

# Test coverage ile
npm run test:coverage

# Watch modda test
npm run test:watch

# Book Service Testleri  
cd ../book-service
npm test
npm run test:coverage

# Order Service Testleri
cd ../order-service
npm test
npm run test:coverage
```

### Test Kapsamları

#### User Service Testleri
- ✅ Kullanıcı kaydı başarılı olur mu?
- ✅ Aynı email ile tekrar kayıt engelleniyor mu?
- ✅ Yanlış şifre ile giriş reddediliyor mu?
- ✅ Eksik alan kontrolü çalışıyor mu?

#### Book Service Testleri
- ✅ Kitap ekleme işlemi doğru çalışıyor mu?
- ✅ Eksik alanlar ile kitap ekleme reddediliyor mu?
- ✅ Kitap listesi döndürülüyor mu?
- ✅ Tek kitap detayı getiriliyor mu?


#### Order Service Testleri
- ✅ Geçerli userId ve bookId ile sipariş oluşturuluyor mu?
- ✅ Geçersiz ID ile sipariş reddediliyor mu?
- ✅ WebSocket üzerinden "orderCreated" eventi tetikleniyor mu?
- ✅ Eksik alanlar kontrol ediliyor mu?


## 🔌 WebSocket Bağlantısı Test Etme

### 1. Web Browser ile Test

Order service otomatik olarak `http://localhost:3002/client.html` adresinde test sayfası sunar.

```bash
# Browser'da aç
http://localhost:3002/client.html
```

### 2. Postman ile WebSocket Testi

1. **Postman'da yeni WebSocket Request oluşturun**
2. **URL**: `ws://localhost:3002`
3. **Connect** butonuna tıklayın
4. **Messages** sekmesinde event'leri dinleyin

### 3. Socket.IO Client ile Test

```javascript
// Node.js test scripti
const io = require('socket.io-client');

const socket = io('http://localhost:3002');

socket.on('connect', () => {
  console.log('Bağlandı:', socket.id);
});

socket.on('orderCreated', (data) => {
  console.log('Yeni sipariş:', data);
});

socket.on('disconnect', () => {
  console.log('Bağlantı kesildi');
});
```

### 4. Real-time Test Senaryosu

1. **WebSocket bağlantısını başlatın** (yukarıdaki yöntemlerden biri)
2. **Yeni sipariş oluşturun**:
```bash
curl -X POST http://localhost:3002/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "bookId": "BOOK_ID_HERE", 
    "quantity": 2
  }'
```
3. **WebSocket istemcisinde `orderCreated` event'ini gözlemleyin**

## 📊 API Kullanım Örnekleri

### User Service

```bash
# Kullanıcı Kaydı
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Giriş
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com", 
    "password": "password123"
  }'
```

### Book Service

```bash  
# Kitap Ekleme
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Book",
    "author": "John Author",
    "price": 29.99
  }'

# Kitap Listesi
curl -X GET http://localhost:3001/api/books
```

### Order Service

```bash
# Sipariş Oluşturma  
curl -X POST http://localhost:3002/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "673905c5c066d509705583be",
    "bookId": "673905d5c066d509705583c0", 
    "quantity": 2
  }'
```

## 🛠️ Geliştirme Notları

### Mikroservis İletişimi
- Order service, user ve book service'lere HTTP istekleri yapar
- Service-to-service authentication için JWT token kullanılır
- Docker environment'ta service discovery için service name'ler kullanılır

### Veritabanı
- Her service kendi MongoDB veritabanını kullanır
- Atlas MongoDB kullanılması önerilir
- Test ortamında in-memory MongoDB kullanılır



## 🐛 Troubleshooting

### Yaygın Problemler

1. **Port Conflict**: Portlar kullanımda ise farklı portları .env dosyasında belirtin
2. **MongoDB Connection**: Atlas bağlantı string'inizi kontrol edin
3. **Docker Issues**: `docker-compose down -v` ile volume'ları temizleyin
4. **Test Failures**: MongoDB Memory Server için yeterli RAM olduğundan emin olun


```
