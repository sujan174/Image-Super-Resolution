const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../log.txt');

function logMiddleware(req, res, next) {
  const logEntry = `${new Date().toISOString()} - ${req.method}: ${req.originalUrl}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });

  next();
}

module.exports = logMiddleware;
