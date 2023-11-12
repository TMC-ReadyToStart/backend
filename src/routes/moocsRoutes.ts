import express from "express";
import { mockedMooc, mockedMoocContent } from "../data/mockedMooc";
import {
  delete_mooc,
  get_all_mooc,
  get_exercises,
  update_percent,
} from "../services/db";
import bodyParser, { BodyParser } from "body-parser";

export const router = express.Router();

router.use(bodyParser.json());

router.get("/all", async (req, res) => {
  const isManager = req.query.is_manager === "true" ? "manager" : "user";
  res.send(await get_all_mooc());
});

router.get("/content/:id", async (req, res) => {
  console.log(req.params.id);
  const numberId = parseInt(req.params.id);
  const exercises = await get_exercises(numberId);
  if (!exercises) return res.status(404).send("Mooc not found");
  res.send(exercises);
});

router.get("/content/exo/:id", (req, res) => {
  console.log(req.params.id);
  const body = req.body;
  console.log("body", body);
  res.send(`Content of exercise ${req.params.id}`);
});

router.get("/content/course/:id", (req, res) => {
  console.log(req.params.id);
  res.send(`Content of course ${req.params.id}`);
});

router.delete("/:id", (req, res) => {
  console.log(req.params.id);
  const numberId = parseInt(req.params.id);
  delete_mooc(numberId);
  res.send(`Delete mooc ${req.params.id}`);
});

router.post("/content/exo/:id", (req, res) => {
  console.log(req.params.id);
  if (req.is("application/json")) {
    const number_id = parseInt(req.params.id);
    const body = req.body;

    update_percent(number_id, body.percent, body.mooc_id);
  }
  res.send(`Content of exercise ${req.params.id}`);
});
