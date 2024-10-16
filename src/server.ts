import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import routes from './routes';
import initializeWebSocketServer from './websockets/websocketHandler';


dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use('/', routes)

app.set("port", process.env.PORT || 9000);

const httpServer = app.listen(app.get("port"), () => {
    console.log(`TMS secure app started at http://localhost:${app.get("port")}`);
});

initializeWebSocketServer(httpServer);