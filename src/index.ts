import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import DailyRotateFile from 'winston-daily-rotate-file';
import winston from 'winston';
import path = require('path');

dotenv.config(); // Load environment variables

const port: string = process.env.PORT || '3000';

const app = express();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'pug');

/// Routes for testing
app.get('/', (req, res) => {
  return res.render('index', { 
    title: 'Home', 
    getTestUrl: 'http://localhost:3000/test', 
    body: 'This the paragraph text.'
  });
});

app.get('/test', (req, res) => {
  return res.send({ body: new Date() });
});

app.post("/submit", (req, res) => {
  console.log(`Note submission: ${req.body.title} & ${req.body.description}`)
  return res.send("Okay")
})

app.use(express.static('public'));
app.set('views', path.join(__dirname, '..', 'src', 'views'))


/// Server sent event
// Route for the server-sent event source
app.get('/sse', (req, res) => {
  // Set the content type to text/event-stream
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  // Send a comment to the client to establish the connection
  res.write(': connected\n\n');

  // Send a message to the client every 5 seconds
  const intervalId = setInterval(() => {
    const data = { message: 'Hello, world!' };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 5000);

  // Handle client disconnections
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

// setup rate-limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
});
app.use(limiter);

// setup logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

// log requests
app.use((req, res, next) => {
  logger.info({
    message: 'Request URL',
    url: req.url,
    method: req.method,
    query: req.query,
    headers: req.headers,
    body: req.body,
  });
  next();
});
