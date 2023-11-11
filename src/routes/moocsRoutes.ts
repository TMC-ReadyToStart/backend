import express from "express";
import { mockedMooc, mockedMoocContent } from "../data/mockedMooc";

export const router = express.Router();

router.get("/all", (req, res) => {
  const isManager = req.query.is_manager === "true" ? "manager" : "user";
  res.send(mockedMooc);
});

router.get("/content/:id", (req, res) => {
  console.log(req.params.id);
  const numberId = parseInt(req.params.id);
  res.send(mockedMoocContent(numberId));
});

router.get("/content/exo/:id", (req, res) => {
  console.log(req.params.id);
  res.send(`Content of exercise ${req.params.id}`);
});

router.get("/content/course/:id", (req, res) => {
  console.log(req.params.id);
  res.send(`Content of course ${req.params.id}`);
});
