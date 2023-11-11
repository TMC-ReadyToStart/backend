import express from "express";
import { mockedUsers } from "../data/mockedUsers";

export const router = express.Router();

router.get("/", async (req, res) => {
  res.send(mockedUsers);
});
