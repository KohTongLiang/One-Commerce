import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path = require('path');
import { EventEmitter } from 'events';
import multer from 'multer';
import sharp from 'sharp';
import { prompt, promptExamples } from './constants';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

dotenv.config(); // Load environment variables

const port: string = process.env.PORT ?? '3000';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? '');
const model = genAI.getGenerativeModel({ model: process.env.GOOGLE_AI_MODEL ?? 'gemini-pro' });

const upload = multer({ dest: 'uploads/' });
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
    appName: 'Sir Know it All',
    formSubmitUrl: 'http://localhost:3000/submit',
    sseUrl: 'http://localhost:3000/sse',
    getFooterUrl: 'http://localhost:3000/test',
    footerText: 'This is a footer text from the server.',
  });
});

app.get('/test', (req, res) => {
  return res.send(`<span>${new Date()}</span>`);
});

app.post('/submit', (req, res) => {
  console.log(`Note submission: ${req.body.title} & ${req.body.description}`);
  notesCache.push({ title: req.body.title, description: req.body.description });
  updateEmitter.emit('updateEvent');
  return res.send("<em class='text-yellow-500'>Successfully Submitted</em>");
});

app.use(express.static('public'));
app.set('views', path.join(__dirname, '..', 'src', 'views'));

/// Server sent event
// Route for the server-sent event source
app.get('/sse', (req, res) => {
  // Set the content type to text/event-stream
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  // Send a comment to the client to establish the connection
  res.write(': connected\n\n');

  // Send a message to the client when cache is updated
  updateEmitter.on('updateEvent', () => {
    console.log('Fired Update Event');
    let htmlResult = '<div>';
    notesCache.forEach((value) => {
      htmlResult += `<p>Title: ${value.title}</p> <p>Description: ${value.description}</p>`;
    });
    htmlResult += '</div>';
    res.write(`data: ${htmlResult} \n\n`);
  });

  // Handle client disconnections
  req.on('close', () => {
    res.end();
  });
});

function fileToGenerativePart(imgBuffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(imgBuffer).toString('base64'),
      mimeType,
    },
  };
}

app.post('/api/v1/image', upload.single('image'), async (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  let imgBuffer = fs.readFileSync(req.file.path);
  let imgWidth, imgHeight;

  try {
    const metadata = await sharp(imgBuffer).metadata();
    const { width, height } = metadata;
    imgWidth = width;
    imgHeight = height;
    console.log(`Image dimensions: ${width}x${height}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing image.');
    return;
  }

  // Prompt construction
  let finalPrompt = [];
  promptExamples.forEach((example) => {
    finalPrompt.push(
      'Example: ',
      fileToGenerativePart(fs.readFileSync(`promptexamples/${example.image}`), example.mime),
      'Output: ',
      example.output,
    );
  });
  finalPrompt.push('Input Image: ', fileToGenerativePart(imgBuffer, req.file.mimetype));
  finalPrompt.push('Prompt: ' + prompt + ' - ' + imgWidth + 'x' + imgHeight);

  const result = await model.generateContent(finalPrompt);
  const response = result.response;
  const text = response.text();

  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error(err);
    }
  });

  const geminiResult = JSON.parse(text);

  return res.render('components/result', {
    title: geminiResult.item_title,
    description: geminiResult.description,
    specifications: geminiResult.specifications,
    use_cases: geminiResult.use_cases,
    seo: geminiResult.SEO_keywords,
  });
});
