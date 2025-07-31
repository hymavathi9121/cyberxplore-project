const fs = require('fs');
const File = require('./models/File');
const queue = require('./queue');
const axios = require('axios');

// Replace with your real or test webhook (e.g. https://webhook.site)
const webhookURL = 'https://webhook.site/5a3bf946-b41b-4c43-b42e-5e0650a13e64'; // TODO: Replace with your own

const dangerousKeywords = ['rm -rf', 'eval', 'bitcoin'];

function scanFile(file) {
  setTimeout(async () => {
    const content = fs.readFileSync(file.path, 'utf-8');
    const isInfected = dangerousKeywords.some(k => content.includes(k));
    const result = isInfected ? 'infected' : 'clean';

    await File.findByIdAndUpdate(file._id, {
      status: 'scanned',
      result,
      scannedAt: new Date()
    });

    console.log(`✅ Scanned ${file.filename} → ${result.toUpperCase()}`);

    // Send webhook alert if infected
    if (isInfected) {
      try {
        await axios.post(webhookURL, {
          filename: file.filename,
          result: 'infected',
          scannedAt: new Date()
        });
        console.log('📣 Webhook alert sent!');
      } catch (err) {
        console.error('❌ Failed to send webhook alert:', err.message);
      }
    }
  }, 2000 + Math.random() * 3000);
}

setInterval(async () => {
  if (!queue.isEmpty()) {
    const file = queue.dequeue();
    scanFile(file);
  }
}, 1000);
