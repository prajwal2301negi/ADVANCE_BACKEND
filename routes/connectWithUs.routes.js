import express from 'express';
import {  isAuthenticated, isUserAuthenticated } from '../middlewares/auth.js';


import { createConnectWithUs, getAllConnects } from '../controllers/connectWithUs.controllers.js';


const router = express.Router();



router.post('/createConnectMessage', createConnectWithUs);
router.get('/getConnectMessages',isAuthenticated,getAllConnects);


export default router;