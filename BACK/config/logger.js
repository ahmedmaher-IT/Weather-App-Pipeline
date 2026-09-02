const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

// إعداد التدوير الشهري للـ Logs
const monthlyTransport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, '../logs/access-%DATE%.log'),
  datePattern: 'YYYY-MM', // سينشئ ملف لكل شهر مثل access-2026-08.log
  zippedArchive: false,   // نتركه كملف نصي عادي حتى يسهل تحميله
  maxFiles: '12m'         // يحتفظ بالملفات لمدة سنة كحد أقصى
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
  ),
  transports: [
    monthlyTransport,
    new winston.transports.Console() // لإظهار الـ Logs في الـ Terminal أيضاً
  ]
});

module.exports = logger;