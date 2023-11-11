export type Mooc = {
  id: number;
  title: string;
  description: string;
  language: string;
};

export type MoocResponse = {
  moocs: Mooc[];
};

export type MoocContent = {
  id: number;
  title: string;
  percent: number;
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
