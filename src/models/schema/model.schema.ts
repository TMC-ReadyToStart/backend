import mongoose from "mongoose";
import { MoocExercise } from "../moocsResponse";

const Schema = mongoose.Schema;

let questionSCH = new Schema({
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
  mcq: {
    type: [String],
  },
});

let MoocExerciseSCH = new Schema({
  id: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  difficulty: {
    type: Number,
  },
  language: {
    type: String,
  },
  percent: {
    type: Number,
  },
  questions: {
    type: [questionSCH],
  },
});

let MoocSchemaSCH = new Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  language: {
    type: String,
  },
  percent: {
    type: Number,
  },
  exercises: {
    type: [MoocExerciseSCH],
  },
  is_loading: {
    type: Boolean,
  },
});

export default mongoose.model("MoocSchemaSCH", MoocSchemaSCH);
