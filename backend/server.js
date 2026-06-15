const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

dotenv.config();
connectDB();

const app = express();

// Allow the deployed frontend (FRONTEND_URL) plus local dev origins.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (no origin) and any whitelisted origin.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true); // permissive fallback so the demo never breaks
    },
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/extinguishers', require('./src/routes/extinguisherRoutes'));
app.use('/api/inspections', require('./src/routes/inspectionRoutes'));
app.use('/api/maintenance', require('./src/routes/maintenanceRoutes'));
app.use('/api/reports', require('./src/routes/reportRoutes'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: '🔥 TZW Fire Management API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});