import { Mooc } from "./moocsResponse";

export type User = {
  id: number;
  username: string;
  moocs: Mooc[];
};

export type UserResponse = {
  users: User[];
};
