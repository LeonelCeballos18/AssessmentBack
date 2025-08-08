import express from 'express';
import config from './config/config.js'
import authRoutes from './routes/auth.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});