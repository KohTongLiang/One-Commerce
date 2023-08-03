import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import DailyRotateFile from 'winston-daily-rotate-file';
import winston from 'winston';
import WebSocket = require('ws');

dotenv.config(); // Load environment variables

const port: string = process.env.PORT || '3000';

const app = express();

const wss = new WebSocket.Server({
  server: app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setup helmet
// app.use(helmet());
// app.use(helmet.hidePoweredBy());
// app.use(helmet.frameguard({ action: 'deny' }));
// app.use(helmet.xssFilter());
// app.use(helmet.noSniff());
// app.use(
//   helmet.hsts({
//     maxAge: 31536000,
//     includeSubDomains: true,
//     preload: true,
//   }),
// );
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"],
//     styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"]
//   }
// }));


/// Routes for testing
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/public' }, err => {
    if (err) {
      console.log(err);
      res.status(500).end();
    }
  });
});

app.get("/test", (req, res) => {
  res.send("Hello from the server!");
});

app.get("/poll", (req, res) => {
  res.send(`Polling get ${new Date()}`);
});

app.post("/test", (req, res) => {
  const reqPayload = req.body.payload;
  res.send(reqPayload + "- Server String here!");
});


/// Web Socket test
wss.on('connection', (ws) => {
  console.log("Established web socket connection")

  ws.on('message', message => {
    console.log(`Message ${message}`)

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        console.log(`Sent to client ${message} - Server Message ${new Date()}`)
        client.send(message.toString());
      }
    })
  })

  ws.on('close', () => {
    console.log("Web socket closed")
  })
})


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

