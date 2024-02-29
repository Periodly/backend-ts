import express, { Express } from "express";
import dotenv from "dotenv";
import sessionRouter from "./api/session";
import userRouter from "./api/user";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/api/session', sessionRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});