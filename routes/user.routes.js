import express from 'express';

import { deleteUser, getParticularUser, getUsers, logOutUser, loginUser, registerUser, updateUserDetails, updateUserPassword } from '../controllers/user.controllers.js';
import {isAuthenticated, isUserAuthenticated} from '../middlewares/auth.js'
import { limiter } from '../index.js';
import { bruteforce } from '../index.js';


const router = express.Router();


router.post('/registerUser',limiter,bruteforce.prevent,registerUser)
router.post('/loginUser',limiter,bruteforce.prevent,loginUser);
router.get('/logoutUser/:id',limiter,isUserAuthenticated,logOutUser);

router.delete('/deleteUser/:id',limiter,isUserAuthenticated,deleteUser);

router.get('/getUserProfile/:id',limiter,isUserAuthenticated,getParticularUser);
router.get('/getUsers',limiter,isAuthenticated,getUsers);

router.put('/updateUserDetails/:id',limiter,isUserAuthenticated,updateUserDetails);
router.put('/updateUserPassword/:id',limiter,isUserAuthenticated,updateUserPassword);






export default router;