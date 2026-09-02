// 1. استدعاء ملف الـ logger من مجلد config
const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
// (استدعاء بقية المكتبات أو نموذج المستخدم هنا...)

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 2. كود التحقق من البيانات والتوكن الخاص بك
    // ... (رمز التحقق من الباسورد والتأكد من المستخدم) ...

    // 3. تسجيل الـ Log فور نجاح عملية الدخول
    logger.info(`User Logged In - Email: ${email} - IP: ${req.ip || req.connection.remoteAddress}`);

    // 4. إرجاع الـ Token والاستجابة للمستخدم
    return res.status(200).json({ 
      token: token, 
      message: "Logged in successfully" 
    });

  } catch (error) {
    logger.error(`Login Error - Email: ${req.body.email} - Error: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};