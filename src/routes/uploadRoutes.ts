import express from "express";

export const router = express.Router();

router.post("/", (req, res) => {
  console.log(req.body);
  res.send("File uploaded");
});
