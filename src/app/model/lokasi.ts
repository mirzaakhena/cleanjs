import { BaseFindManyFilter, Identifier } from "../../framework/repo.js";

export type LokasiID = Identifier;
export type Lokasi = {
  id: LokasiID;
  name?: string;
};

// =============================================================================================================================

export type FindManyLokasiFilter = BaseFindManyFilter & {
  //
};

// =============================================================================================================================
