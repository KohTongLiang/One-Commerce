import express from 'express'
import path from 'path';

const router = express.Router()
const viewPath = path.join(__dirname, '..', 'views');

router.use(express.static(path.join(__dirname, '..', 'views')));

router.get('/header', (req, res) => {
    return res.sendFile(viewPath + "/layout/header.html");
})

router.get('/footer', (req, res) => {
    return res.sendFile(viewPath + "/layout/footer.html");
})

router.get('/formUpload', (req, res) => {
    return res.sendFile(viewPath + "/components/formupload.html");
})



export default router