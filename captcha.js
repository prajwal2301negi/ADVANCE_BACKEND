import Captcha from 'node-captcha-generator';
import express from 'express';
import asyncErrorHandler from './utils/asyncErrorHandler';
const app = express();

app.get('/get-captcha', asyncErrorHandler(async (req, res) => {
    let captcha = new Captcha({
        length: 5,
        size: {
            width: 450,
            height: 200
        }
    })

    await captcha.toBase64(async (err, base64) => {
        if (err) {
            res.status(500).send('Error');
        } else {
            res.send(base64);
        }
    })
}))
