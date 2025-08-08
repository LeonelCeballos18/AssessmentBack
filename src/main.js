import express from 'express';
import config from './config/config.js'

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});