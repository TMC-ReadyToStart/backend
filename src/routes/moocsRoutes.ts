import express from "express";

export const router = express.Router();

router.get("/all", (req, res) => {
  const isManager = req.query.is_manager === "true" ? "manager" : "user";
  res.send(`List of all ${isManager} moocs`);
});

router.get("/content/:id", (req, res) => {
  console.log(req.params.id);
  res.send(`Content of mooc ${req.params.id}`);
});

router.get("/content/exo/:id", (req, res) => {
  console.log(req.params.id);
  res.send(`Content of exercise ${req.params.id}`);
});

router.get("/content/course/:id", (req, res) => {
  console.log(req.params.id);
  res.send(`Content of course ${req.params.id}`);
});
