import express from "express";
import { mockedUsers } from "../data/mockedUsers";

export const router = express.Router();

router.get("/", (req, res) => {
  res.send(mockedUsers);
});
