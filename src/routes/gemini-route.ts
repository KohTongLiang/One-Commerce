import express from "express";
import sharp from "sharp";
import fs from 'fs';
import multer from 'multer';
import {GoogleGenerativeAI} from '@google/generative-ai';
import {prompt, promptExamples} from "../constants";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? '');
const model = genAI.getGenerativeModel({model: process.env.GOOGLE_AI_MODEL ?? 'gemini-pro'});
const upload = multer({dest: 'uploads/'});

type GeminiResult = {
    item_title: string;
    description: string;
    specifications: {
        [key: string]: {
            [key: string]: string;
        };
    };
    use_cases: string[];
    SEO_keywords: string[];
};


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
    let geminiResult: GeminiResult;

    let imgBuffer = fs.readFileSync(req.file.path);
    let imgWidth, imgHeight;

    try {
        const metadata = await sharp(imgBuffer).metadata();
        const {width, height} = metadata;
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

    try {
        geminiResult = JSON.parse(text);
        console.log(text);
        
        return res.render('templates/result', {
            title: geminiResult.item_title,
            description: geminiResult.description,
            specifications: geminiResult.specifications,
            use_cases: geminiResult.use_cases,
            seo: geminiResult.SEO_keywords,
        });
    } catch (error) {
        console.log(error)
        return res.render('templates/error', {
            errorMessage: "Error processing results."
        })
    }
});

// Testing frontend
router.get('/test', async (_req, res) => {
    const geminiResult = {
        "item_title": "Adorable Axolotl Merchandise - Tote Bag & Keychain",
        "description": "Embrace the cuteness of axolotls with this delightful merchandise set! Featuring a charming tote bag adorned with an axolotl design and a matching keychain, this combo is perfect for axolotl enthusiasts and anyone who appreciates unique and eye-catching accessories.",
        "specifications": {
            "Tote Bag": {
                "Material": "Durable canvas or fabric",
                "Size": "Varies (e.g., 15x18 inches)",
                "Design": "Axolotl print or illustration"
            },
            "Keychain": {
                "Material": "Acrylic or rubber",
                "Size": "Compact and lightweight",
                "Design": "Axolotl charm with a keyring attachment"
            }
        },
        "use_cases": [
            "Everyday Carryall: The tote bag is perfect for carrying books, groceries, or everyday essentials.",
            "Travel Companion: Pack your belongings in style and show your love for axolotls on your adventures.",
            "Gift Idea: Surprise your friends, family, or fellow axolotl enthusiasts with a unique and thoughtful gift.",
            "Collectible Item: Expand your axolotl collection with these adorable and functional pieces.",
            "Fashion Statement: Add a touch of personality and whimsy to your outfit with the eye-catching axolotl designs."
        ],
        "SEO_keywords": [
            "axolotl",
            "axolotl merchandise",
            "tote bag",
            "keychain",
            "cute accessories",
            "animal lover gifts",
            "unique gifts",
            "kawaii",
            "amphibian",
            "neotenic"
        ]
    }

    return res.render('templates/result', {
        title: geminiResult.item_title,
        description: geminiResult.description,
        specifications: geminiResult.specifications,
        use_cases: geminiResult.use_cases,
        seo: geminiResult.SEO_keywords,
    });
});

export default router