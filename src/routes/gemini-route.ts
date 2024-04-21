import express from "express";
import sharp from "sharp";
import fs from 'fs';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {prompt, promptExamples} from "../constants";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? '');
const model = genAI.getGenerativeModel({ model: process.env.GOOGLE_AI_MODEL ?? 'gemini-pro' });
const upload = multer({ dest: 'uploads/' });

function fileToGenerativePart(imgBuffer: Buffer, mimeType: string) {
    return {
        inlineData: {
            data: Buffer.from(imgBuffer).toString('base64'),
            mimeType,
        },
    };
}

router.post('/image', upload.single('image'), async (req, res, next) => {
    if (!req.file) {
        res.status(400).send('No files were uploaded.');
        return;
    }
    let geminiResult;

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

    geminiResult = JSON.parse(text);

    return res.render('templates/result', {
        title: geminiResult.item_title,
        description: geminiResult.description,
        specifications: geminiResult.specifications,
        use_cases: geminiResult.use_cases,
        seo: geminiResult.SEO_keywords,
    });
});

export default router