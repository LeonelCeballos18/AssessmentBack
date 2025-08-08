import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT,
  client_url: process.env.CLIENT_URL,
};

export default config;