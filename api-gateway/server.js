const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");

dotenv.config();

const app = express();

// security middleware
app.use(helmet());
app.use(cors());

// Logging
app.use(morgan("combined"));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "api-gateway",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Gateway info
app.get("/", (req, res) => {
  res.json({
    service: "API GATEWAY",
    version: "1.0.0",
    endpoints: {
      user: "/api/users",
      book: "/api/books",
      order: "/api/orders",
    },
  });
});
// Service endpoints configuration
const services = {
  users: {
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/users": "/api/users" },
  },
  books: {
    target: process.env.BOOK_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/books": "/api/books" },
  },
  orders: {
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/orders": "/api/orders" },
  },
};
// Middleware imports
const authMiddleware = require('./middleware/auth')
const loggingMiddleware = require('./middleware/logging');

// Apply middleware
app.use(loggingMiddleware)

// proxy routes
app.use("/api/users", createProxyMiddleware(services.users));
app.use("/api/books", createProxyMiddleware(services.books));
// protected order route
app.use("/api/orders", authMiddleware, createProxyMiddleware(services.orders));


// Error handling for proxy
app.use((err, req, res, next) => {
  if (err && err.code === 'ECONNREFUSED') {
    res.status(503).json({
      error: 'Service Unavailable',
      message: 'The requested service is currently unavailable'
    });
  } else {
    next(err);
  }
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message
  });
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ API Gateway running on port ${PORT}`);
});