import "dotenv/config";
import express from "express";
import router from "./routes/routes";


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', router);

export default app;


