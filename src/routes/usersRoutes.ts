import express from "express";
import { mockedUsers } from "../data/mockedUsers";
import { testAssistant } from "../services/bardai";

export const router = express.Router();

router.get("/", async (req, res) => {
  res.send(mockedUsers);
});
