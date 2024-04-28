import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import sharp from "sharp";
import { prompt, promptExamples } from "../constants";

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
        let imgBuffer = fs.readFileSync(filePath);
        let imgWidth, imgHeight;

        try {
            const metadata = await sharp(imgBuffer).metadata();
            const { width, height } = metadata;
            imgWidth = width;
            imgHeight = height;
            console.log(`Image dimensions: ${width}x${height}`);
        } catch (error) {
            console.error(error);
            reject(new Error("Error processing image."));
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
                console.error(err);
            }
        });

        console.log(text);

        try {
            geminiResult = JSON.parse(text);
            resolve(geminiResult);
        } catch (error) {
            reject(error);
        }
    })
}