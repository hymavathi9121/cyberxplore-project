const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const queue = require('../queue');
const path = require('path');
const fs = require('fs');

const router = express.Router(); // ✅ missing from your snippet above

// Multer config
const upload = multer({
  dest: path.join(__dirname, '../uploads/'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.jpg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// Upload API
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save file metadata to MongoDB
    const file = new File({
      filename: req.file.originalname,
      path: req.file.path
    });

    await file.save();

    // Enqueue file for scanning
    queue.enqueue(file);

    res.status(200).json({ message: 'Uploaded', file });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error during upload.' });
  }
});

// Fetch all files (with pagination support)
router.get('/files', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
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
