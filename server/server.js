import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import http from 'http'
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import authRoutes from "./routes/authRoutes.js";


const app = express();
const port = process.env.port || 5000;
const server = http.createServer(app);

//.cors() so that our front end will be able to talk to the backend
app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/home', homeRoutes);

server.listen(port, () => {
  console.log(`server is now running on port ${port}`);
});
