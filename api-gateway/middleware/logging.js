const loggingMiddleware = (req, res, next) => {
  // Log request start
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  // Add request ID to headers
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);
  
  // Log request details
  console.log(`[${new Date().toISOString()}] ${requestId} - ${req.method} ${req.path} - Started`);
  
  // Capture response
  const originalSend = res.send;
  res.send = function(data) {
    res.send = originalSend;
    
    // Log response
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${requestId} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    return res.send(data);
  };
  
  next();
};

module.exports = loggingMiddleware;