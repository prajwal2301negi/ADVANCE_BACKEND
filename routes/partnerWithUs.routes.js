import express from 'express';
import { getAllPartnershipRequests, partnerUsPost } from '../controllers/partnerWithUs.controllers.js';
import { isAuthenticated } from '../middlewares/auth.js';



const router = express.Router();


router.post('/partnerUs/post',partnerUsPost);
router.get('/getAllRequests',isAuthenticated,getAllPartnershipRequests);

export default router;