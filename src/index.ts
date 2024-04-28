import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import viewRoutes from './routes/view-routes';
import geminiRoute from "./routes/gemini-route";
// import shopifyRoute from "./routes/shopify-route";
import path = require('path');
import logger from './services/logger';

dotenv.config(); // Load environment variables

const port: string = process.env.PORT ?? '3000';
const app = express();

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static('public'))

// Routes setup
app.use('/views', viewRoutes)
app.use('/api/v1/gemini', geminiRoute)
// app.use('/api/v1/shopify', shopifyRoute)

// View setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '..', 'src', 'views'));

app.get('/', (req, res) => {
  return res.sendFile("/index.html");
});

