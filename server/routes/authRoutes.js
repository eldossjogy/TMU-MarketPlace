import express from "express";
import {registerAccountDetails} from '../controllers/authAPI.js'

const router = express.Router();

router.post('/register', registerAccountDetails)

export default router;


