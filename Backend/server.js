const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const router = express.Router();
// Serve uploaded videos statically
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Routes
app.use('/api', apiRoutes);




// Start server
app.listen(3000, () => console.log('Server running on port 3000'));