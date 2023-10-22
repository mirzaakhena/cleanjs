import { Identifier } from "../../framework/repo.js";

export type ImageID = Identifier;
export type Image = {
  id: ImageID;
  name: string;
  url: string;
};
