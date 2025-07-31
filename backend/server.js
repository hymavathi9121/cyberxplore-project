const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', uploadRoutes);

// MongoDB Atlas URI — replace <username>, <password>, and <dbname>
const MONGO_URI = 'mongodb+srv://cyberuser:mypassword123@webhookcluster.qnmhtkh.mongodb.net/cyberxplore?retryWrites=true&w=majority&appName=WebhookCluster';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' MongoDB Atlas connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Start the background worker for malware scanning
require('./worker');

