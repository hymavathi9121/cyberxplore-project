const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  status: { type: String, default: 'pending' },
  result: { type: String, default: null },
  uploadedAt: { type: Date, default: Date.now },
  scannedAt: { type: Date, default: null }
});

module.exports = mongoose.model('File', fileSchema);
