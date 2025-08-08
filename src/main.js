import express from 'express';
import config from './config/config.js'
import authRoutes from './routes/auth.routes.js';
import vehicleRoutes from './routes/car.routes.js';
import http from 'http';
import cors from 'cors';
import { initSocket } from './socket.js';

const app = express();
app.use(cors({ origin: [config.client_url], credentials: false }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/car', vehicleRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

const server = http.createServer(app);
initSocket(server, config.client_url);


app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});