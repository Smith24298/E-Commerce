import "dotenv/config";
import express from "express";
import router from "./routes/routes";
import cookieParser from "cookie-parser";


const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', router);

export default app;


