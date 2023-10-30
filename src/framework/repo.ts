import { Inport } from "./core.js";

export type BaseFindManyFilter = {
  page: number;
  size: number;
};

export type Identifier = string;

export class BaseEntity<T extends Identifier> {
  id: T;
}

export type SaveEntity<T, ID extends Identifier> = Inport<T, ID>;

export type FindManyEntity<T, U extends BaseFindManyFilter> = Inport<U, [T[], number]>;

export type FindOneEntity<T, ID extends Identifier> = Inport<ID, T | null>;

export type DeleteEntity<ID extends Identifier> = Inport<ID, void>;
