export type Mooc = {
  id: number;
  title: string;
  description: string;
  language: string;
  progress: number;
  has_exercise: number;
};

export type question = {
  question: string;
  answer: string;
  mcq: string[];
};

export type MoocResponse = {
  moocs: Mooc[];
};

export type MoocContent = {
  id: number;
  title: string;
  percent: number;
  description: string;
  date: string;
  is_exercise: boolean;
};

export type MoocContentResponse = {
  mooc: Mooc;
  mooc_contents: MoocContent[];
};

export type MoocContentCourse = {
  id: number;
  mooc_content: MoocContent;
  title: string;
  description: string;
  duration: number;
};

export type MoocExercise = {
  id: number;
  title: string;
  description: string;
  percent: number;
  questions: question[];
  date: string;
};
