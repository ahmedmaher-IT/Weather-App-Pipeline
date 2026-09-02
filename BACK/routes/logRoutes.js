const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
// ينبغي إضافة Auth Middleware للتأكد أن المستخدم Admin فقط

// 1. تنزيل ملف الـ Log لشهري معين
router.get('/download/:month', (req, res) => {
  const month = req.params.month; // e.g. "2026-08"
  const filePath = path.join(__dirname, `../logs/access-${month}.log`);

  if (fs.existsSync(filePath)) {
    res.download(filePath, `access-${month}.log`);
  } else {
    res.status(404).json({ error: "No logs found for this month" });
  }
});

// 2. مسح ملف الـ Log بعد التحميل
router.delete('/delete/:month', (req, res) => {
  const month = req.params.month;
  const filePath = path.join(__dirname, `../logs/access-${month}.log`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // مسح الملف فوراً من السيرفر
    res.status(200).json({ message: `Log file for ${month} deleted successfully from server.` });
  } else {
    res.status(404).json({ error: "Log file does not exist" });
  }
});

module.exports = router;