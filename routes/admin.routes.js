import express from 'express';

import {isAuthenticated} from '../middlewares/auth.js'
import { getParticularAdmin, logOutAdmin, loginAdmin, registerAdmin, updateAdminDetails, updateAdminPassword } from '../controllers/admin.controllers.js';
import { limiter } from '../index.js';

const router = express.Router();


router.post('/registerAdmin',limiter,registerAdmin)
router.post('/loginAdmin',limiter,loginAdmin);
router.get('/logoutAdmin',limiter,isAuthenticated,logOutAdmin);



router.get('/getAdminProfile',limiter,isAuthenticated,getParticularAdmin);


router.put('/updateAdminDetails',limiter,isAuthenticated,updateAdminDetails);
router.put('/updateAdminPassword',limiter,isAuthenticated,updateAdminPassword);



export default router;