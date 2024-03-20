import express from "express";
import {getCategories, getStatusList} from '../controllers/homeAPI.js'

const router = express.Router();

router.get('/get-categories', getCategories)
router.get('/get-status-list', getStatusList)

export default router;


