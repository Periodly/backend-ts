import express, { Express } from 'express';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import './db';

import sessionRouter from './api/session';
import userRouter from './api/user';
import friendsRouter from './api/friends';
import moodRouter from './api/mood';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PRDLY-lite API',
      version: '0.0.2',
    },
  },
  apis: ['./src/api/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(express.json());
app.use(cors());
app.use('/api/session', sessionRouter);
app.use('/api/user', userRouter);
app.use('/api/mood', moodRouter);
app.use('/api/friends', friendsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
