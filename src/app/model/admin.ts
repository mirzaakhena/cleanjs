import { BaseFindManyFilter, Identifier } from "../../framework/repo.js";

export type AdminID = Identifier;

export type Admin = {
  id: AdminID;
  name?: string;
};

// =============================================================================================================================

export type FindManyAdminFilter = BaseFindManyFilter & {
  //
};

// =============================================================================================================================
