import Router from 'express';
import { verifyToken } from '../middleware/tokenAuthMiddleware';
import { addMultipleExpenses, addCategories, getCategories, getExpenses, updateCategories, deleteCategories, updateExpenses, deleteExpenses } from '../controllers/expenseTrackingController';

const router = Router();

router.post('/addExpenses', verifyToken, addMultipleExpenses);
router.get('/getExpenses/:accountId', verifyToken, getExpenses);
router.put('/updateExpenses', verifyToken, updateExpenses);
router.delete('/deleteExpenses', verifyToken, deleteExpenses);
router.post('/addCategories', verifyToken, addCategories);
router.get('/getCategories/:accountId', verifyToken, getCategories);
router.put('/updateCategories', verifyToken, updateCategories);
router.delete('/deleteCategories', verifyToken, deleteCategories);

export default router;