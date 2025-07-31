const express = require('express');
const router = express.Router();
const multer = require('multer');
const File = require('../models/File');
const queue = require('../queue');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Multer config
const upload = multer({
  dest: path.join(__dirname, '../uploads/'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.jpg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// POST /upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Optional Redis check skipped

    const file = new File({
      filename: req.file.originalname,
      path: req.file.path
    });

    await file.save();
    queue.enqueue(file);
    res.status(200).json({ message: 'Uploaded', file });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error during upload.' });
  }
});

//GET /files with pagination
router.get('/files', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await File.countDocuments();
    const files = await File.find().sort({ uploadedAt: -1 }).skip(skip).limit(limit);

    res.json({ files, total });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Error fetching files.' });
  }
});

module.exports = router;
