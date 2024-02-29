import express, { Response, Request } from "express";
import {body, header} from "express-validator";
import {minPasswordLength} from "../config";
import {handleValidationError, sendErrorStatusCode} from "../error";
import {createUser} from "../service/user";
import sessionRouter from "./session";

const userRouter = express.Router();

userRouter.post(
  '/',
  body('username').isString(),
  body('password').isString().isLength({
    min: minPasswordLength,
  }),
  body("admin").isBoolean(),
  header("Authorization").isString().contains("Bearer"),
  (req: Request, res: Response) => {
    if (handleValidationError(req, res)) return;

    const token = req.get("Authorization")!.substring(7);

    createUser(req.body.username, req.body.password, req.body.admin, token)
      .then(() => res.sendStatus(200))
      .catch((err) => sendErrorStatusCode(err, res));
  }
);

export default userRouter;