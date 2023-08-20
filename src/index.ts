import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path = require('path');
import { EventEmitter } from 'events';

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

/// Some vars
let notesCache = new Array();
const updateEmitter = new EventEmitter();

/// Routes for testing
app.get('/', (req, res) => {
  return res.render('index', { 
    title: 'Home', 
    formSubmitUrl: 'http://localhost:3000/submit',
    sseUrl: 'http://localhost:3000/sse',
    getFooterUrl: 'http://localhost:3000/test', 
    footerText: 'This is a footer text from the server.'
  });
});

app.get('/test', (req, res) => {
  return res.send(`<span>${new Date()}</span>`);
});

app.post("/submit", (req, res) => {
  console.log(`Note submission: ${req.body.title} & ${req.body.description}`)
  notesCache.push({ title: req.body.title, description: req.body.description })
  updateEmitter.emit("updateEvent");
  return res.send("<em class='text-yellow-500'>Successfully Submitted</em>")
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

  // Send a message to the client when cache is updated
  updateEmitter.on("updateEvent", () => {
    console.log("Fired Update Event");
    let htmlResult = "<div>";
    notesCache.forEach((value) => {
      htmlResult += `<p>Title: ${value.title}</p> <p>Description: ${value.description}</p>`;
    });
    htmlResult += "</div>";
    res.write(`data: ${htmlResult} \n\n`);
  });

  // Handle client disconnections
  req.on('close', () => {
    res.end();
  });
});
