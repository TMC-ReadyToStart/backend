import { UserResponse } from "../models/userResponse";
import { mockedMooc } from "./mockedMooc";

const username: string[] = [
  "John Doe",
  "Jane Doe",
  "John Smith",
  "Jane Smith",
  "John Wayne",
  "Jane Wayne",
  "John Wick",
  "Jane Wick",
];

const ids: number[] = [0, 1, 2, 3, 4, 5, 6, 7];

export const mockedUsers: UserResponse = {
  users: ids.map((id, index) => ({
    id,
    username: username[index],
    moocs: mockedMooc.moocs,
  })),
};
