import express from 'express';
import cors from "cors";
import http from 'http'
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import adRoutes from "./routes/adRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import myMarketRoutes from "./routes/myMarketRoutes.js";


const app = express();
const port = process.env.port || 5000;
const server = http.createServer(app);

//.cors() so that our front end will be able to talk to the backend
app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/home', homeRoutes);
app.use('/ad', adRoutes);
app.use('/search', searchRoutes);
app.use('/my-market', myMarketRoutes);

server.listen(port, () => {
  console.log(`server is now running on port ${port}`);
});
