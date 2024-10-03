import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import sharp from 'sharp';

import { prompt, promptExamples } from '../constants';
import logger from './logger';

dotenv.config(); // Load environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? '');
const model = genAI.getGenerativeModel({ model: process.env.GOOGLE_AI_MODEL ?? 'gemini-pro' });

type dict = { [key: string]: string };

type GeminiResult = {
  item_title: string;
  description: string;
  specifications: {
    [key: string]: { [key: string]: string };
  };
  common_faqs: dict;
  potential_use_cases: string[];
  compatibility: dict;
  safety_and_compliance: string;
  seo_keywords: string[];
};

function fileToGenerativePart(imgBuffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(imgBuffer).toString('base64'),
      mimeType,
    },
  };
}

export async function generateGeminiResult(mimeType: string, filePath: string): Promise<GeminiResult> {
  return new Promise<GeminiResult>(async (resolve, reject) => {
    let geminiResult: GeminiResult;
    const imgBuffer = fs.readFileSync(filePath);
    let imgWidth, imgHeight;

    try {
      const metadata = await sharp(imgBuffer).metadata();
      const { width, height } = metadata;
      imgWidth = width;
      imgHeight = height;
      logger.info(`Image dimensions: ${width}x${height}`);
    } catch (error) {
      logger.error(error);
      reject(new Error('Error processing image.'));
    }

    // Prompt construction
    let finalPrompt = [];
    promptExamples.forEach((example) => {
      finalPrompt.push(
        'Examples: ',
        fileToGenerativePart(fs.readFileSync(`promptexamples/${example.image}`), example.mime),
        'Output: ',
        example.output,
      );
    });
    finalPrompt.push('Input Image: ', fileToGenerativePart(imgBuffer, mimeType));
    finalPrompt.push('Prompt: ' + prompt + ' - ' + imgWidth + 'x' + imgHeight);

    const result = await model.generateContent(finalPrompt);
    const response = result.response;
    const text = response.text();

    fs.unlink(filePath, (err) => {
      if (err) {
        logger.error(err);
      }
    });

    logger.info(`Gemini AI Response: ${text}`);

    try {
      geminiResult = JSON.parse(text);
      resolve(geminiResult);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}
