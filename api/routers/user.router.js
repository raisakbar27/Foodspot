import express from 'express';
import { deleteUser, test, updateUser, getUserList } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/list/:id', verifyToken, getUserList);


export default router;

