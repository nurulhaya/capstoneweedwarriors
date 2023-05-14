import express from 'express';
import apiRoutes from './server/routes/apiRoutes.js';
import { Storage } from '@google-cloud/storage';
import Multer from 'multer';
import * as path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

let projectId = process.env.PROJECT_ID;
let keyFilename = process.env.STORAGE_KEY;
const storage = new Storage({
    projectId,
    keyFilename,
});
const bucket = storage.bucket(process.env.STORAGE_BUCKET);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('client'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', apiRoutes);

app.post("/upload", multer.single("hidden-new-file"), (req, res) => {
    try {
        if (req.file) {
            const blob = bucket.file(req.file.originalname);
            const blobStream = blob.createWriteStream();

            blobStream.on("finish", () => {
                res.status(200).send("Successfully uploaded image");
            });
            blobStream.end(req.file.buffer);
        } else throw "Error with image";
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/oms', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/oms.html'));
});

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
});