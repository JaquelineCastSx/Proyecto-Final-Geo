require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const locRoutes = require('./routes/locationRoutes');
const shapeRoutes = require('./routes/shapeRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/locations', locRoutes);
app.use('/api/shapes', shapeRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
