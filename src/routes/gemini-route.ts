import express from "express";
import multer from 'multer';
import {generateGeminiResult} from "../services/gemini-service";

const router = express.Router();
const upload = multer({dest: 'uploads/'});

router.post('/image', upload.single('image'), async (req, res, next) => {
    if (!req.file) {
        res.status(400).send('No files were uploaded.');
        return;
    }

    console.log(req.file.size);
    
    return await generateGeminiResult(req.file.mimetype, req.file.path).then((geminiResult) => {
        return res.render('templates/result', geminiResult);
    }).catch((error) => {
        return res.render('templates/error', {
            errorMessage: "Error processing results."
        })
    });
});

export default router