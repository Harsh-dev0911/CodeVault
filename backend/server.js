const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Routes
const authRoutes = require('./routes/authRoutes');
const snippetRoutes = require('./routes/snippetRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/snippets', snippetRoutes);

// Serve Static Frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Health Check (fallback)
app.get('/api/health', (req, res) => res.send('CodeVault API is running'));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codevault').then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(error => {
    console.error('MongoDB connection error:', error);
});
