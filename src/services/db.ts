import MoocSchemaSCH from "../models/schema/model.schema";
import { Mooc, MoocExercise, question } from "../models/moocsResponse";
import { title } from "process";

export const create_mooc_entry = async (
  title: string,
  language: string,
  description: string
) => {
  //get the last id
  const last_mooc = await MoocSchemaSCH.findOne().sort({ id: -1 });
  const id = last_mooc ? last_mooc.id + 1 : 0;
  const mooc = new MoocSchemaSCH({
    id: id,
    title: title,
    description: description,
    language: language,
    percent: 0,
    exercises: [],
    is_loading: false,
  });

  // Save the malware entry to the MongoDB database
  await mooc.save();
  console.log(`Entry ${title} added to database`);
  return id;
};

export const add_mooc_exercise = async (
  title_moc: string,
  title: string,
  description: string,
  questions: question[]
) => {
  const mooc = await MoocSchemaSCH.findOne({ title: title_moc });
  if (mooc) {
    const last_exercise = mooc.exercises[mooc.exercises.length - 1];
    const exercise_id = last_exercise ? last_exercise.id + 1 : 0;
    const exercise: MoocExercise = {
      id: exercise_id,
      title: title,
      description: description,
      percent: 0,
      questions: questions,
      date: new Date().toISOString(),
    };
    mooc.exercises.push(exercise);
    await mooc.save();
    console.log(`Exercise ${title} added to database`);
  } else {
    console.log(`Mooc ${title} not found`);
  }
};

export async function get_all_mooc() {
  const moocs = await MoocSchemaSCH.find();
  const moocsResponse: Mooc[] = moocs!.map((mooc) => {
    let loading;
    if (mooc.exercises.length > 0 && !mooc.is_loading) {
      loading = 3;
    } else if (mooc.exercises.length > 0 && mooc.is_loading) {
      loading = 2;
    } else if (mooc.exercises.length == 0 && mooc.is_loading) {
      loading = 1;
    } else {
      loading = 0;
    }
    return {
      id: mooc.id! as number,
      title: mooc.title as string,
      description: mooc.description as string,
      language: mooc.language as string,
      progress: mooc.percent as number,
      has_exercise: loading,
    };
  });
  return moocsResponse;
}

export async function get_mooc(id: number) {
  const mooc = await MoocSchemaSCH.findOne({ id: id });
  if (!mooc) return null;
  let loading;
  if (mooc.exercises.length > 0 && !mooc.is_loading) {
    loading = 3;
  } else if (mooc.exercises.length > 0 && mooc.is_loading) {
    loading = 2;
  } else if (mooc.exercises.length == 0 && mooc.is_loading) {
    loading = 1;
  } else {
    loading = 0;
  }
  const moocResponse: Mooc = {
    id: mooc!.id! as number,
    title: mooc!.title as string,
    description: mooc!.description as string,
    language: mooc!.language as string,
    progress: mooc!.percent as number,
    has_exercise: loading,
  };
  return moocResponse;
}

export async function get_exercises(id: number) {
  const mooc = await MoocSchemaSCH.findOne({ id: id });
  if (!mooc) return null;
  const exercises: MoocExercise[] = mooc!.exercises.map((exercise) => {
    if (!exercise.date)
      mooc!.exercises[mooc!.exercises.indexOf(exercise)].date =
        new Date().toISOString();
    return {
      id: exercise.id as number,
      title: exercise.title as string,
      description: exercise.description as string,
      difficulty: exercise.difficulty as number,
      percent: exercise.percent as number,
      questions: exercise.questions as question[],
      date: exercise.date as string,
    };
  });
  mooc.save();
  return exercises;
}

export async function update_percent(
  id: number,
  percent: number,
  mooc_id: number
) {
  console.log("update_percent", id, percent, mooc_id);
  const mooc = await MoocSchemaSCH.findOne({ id: mooc_id });
  if (!mooc) return null;
  const exercise = mooc.exercises.find((exercise) => exercise.id === id);
  if (!exercise) return null;
  exercise.percent = percent;
  mooc.percent = mooc.exercises.reduce(
    (acc, exercise) => acc + exercise.percent!,
    0
  );
  mooc.percent = mooc.percent / mooc.exercises.length;
  await mooc.save();
  return exercise;
}

export async function delete_mooc(id: number) {
  const mooc = await MoocSchemaSCH.findOne({ id: id });
  if (!mooc) return null;
  await mooc.deleteOne();
  await MoocSchemaSCH.updateMany(
    { id: { $gt: id } },
    { $inc: { id: -1 } },
    { multi: true }
  );
  return mooc;
}
