import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import connectDB from './config/db';
import routes from './routes';


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use('/', routes)

const server = createServer(app);

const PORT = process.env.PORT || 5555;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
