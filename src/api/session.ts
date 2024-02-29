import express, { Request, Response } from "express";
import { body } from 'express-validator';
import { minPasswordLength } from "../config";
import { handleValidationError, sendErrorStatusCode } from "../error";
import { login } from "../service/session";

const sessionRouter = express.Router();

sessionRouter.post(
    '/login',
    body('username').isString(),
    body('password').isString().isLength({
        min: minPasswordLength,
    }),
    (req: Request, res: Response) => {
        if (handleValidationError(req, res)) return;
        login(req.body.username, req.body.password)
            .then((token) =>
                res.json({token})
            )
            .catch((err) => sendErrorStatusCode(err, res));
    }
);

export default sessionRouter;