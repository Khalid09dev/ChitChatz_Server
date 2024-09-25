import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller.js';
import privateRoute from '../middlewares/privateRoute.js';
import multer from 'multer';
import multers3 from 'multer-s3';
import s3 from '../config/awsS3.js';


const upload = multer({
    storage: multers3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET,
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname});
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname)
        }
    })
})

const router = express.Router();

router.get('/:id/:jwt', privateRoute, getMessages);
router.post('/send/:id', privateRoute, upload.array('files'), sendMessage);

export default router;