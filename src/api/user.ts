import express from "express";

const userRouter = express.Router();

// login user
userRouter.post("/login", (req, res) => {
  res.send("Login user");
});

userRouter.post("/register", (req, res) => {
  res.send("Register user");
});