import express from "express";

const sessionRouter = express.Router();
import { body } from 'express-validator';

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