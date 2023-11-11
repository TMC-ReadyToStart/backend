import { randomInt } from "crypto";
import { MoocContentResponse, MoocResponse } from "../models/moocsResponse";

const languages: string[] = [
  "python",
  "javascript",
  "java",
  "c",
  "c++",
  "c#",
  "php",
  "ruby",
];

const titles: string[] = [
  "Learn Python",
  "Learn JavaScript",
  "Learn Java",
  "Learn C",
  "Learn C++",
  "Learn C#",
  "Learn PHP",
  "Learn Ruby",
];

const ids: number[] = [0, 1, 2, 3, 4, 5, 6, 7];

const descriptions: string[] = [
  "Learn Python with this course",
  "Learn JavaScript with this course",
  "Learn Java with this course",
  "Learn C with this course",
  "Learn C++ with this course",
  "Learn C# with this course",
  "Learn PHP with this course",
  "Learn Ruby with this course",
];

const mooc_titles: string[] = [
  "Basics",
  "Variables",
  "Operators",
  "Data Types",
  "loops",
  "Casting",
  "Strings",
  "Booleans",
];

export const mockedMooc: MoocResponse = {
  moocs: ids.map((id, index) => ({
    id,
    title: titles[index],
    description: descriptions[index],
    language: languages[index],
  })),
};

export const mockedMoocContent = (id: number) => {
  const mooc = mockedMooc.moocs[id];
  return {
    mooc: mooc,
    mooc_contents: mooc_titles.map((title, index) => ({
      id: index,
      title: `${mooc.language} ${title}`,
      percent: randomInt(0, 101),
      date: new Date().toISOString(),
      is_exercise: randomInt(0, 2) === 1,
    })),
  } as MoocContentResponse;
};
