import { Inport } from "../../framework/core.js";

export type FindUser = Inport<string, string>;

export type FindPosition = Inport<boolean, boolean>;

export type FindDepartment = Inport<number, number>;

// =================================================================

// export type SaveXXXXXXXXXXXXXXXXX = Inport<XXXXXXXXXXXXXXXXX, XXXXXXXXXXXXXXXXXID>;

// export type FindManyXXXXXXXXXXXXXXXXXFilter = {
//   //
// };

// export type FindManyXXXXXXXXXXXXXXXXX = Inport<FindManyXXXXXXXXXXXXXXXXXFilter, [XXXXXXXXXXXXXXXXX[], number]>;

// export type FindOneXXXXXXXXXXXXXXXXX = Inport<XXXXXXXXXXXXXXXXXID, XXXXXXXXXXXXXXXXX | null>;

// export type DeleteXXXXXXXXXXXXXXXXX = Inport<XXXXXXXXXXXXXXXXXID, void>;
