import { BaseFindManyFilter, Identifier } from "../../framework/repo.js";
import { Lokasi } from "./lokasi.js";

export type TenantID = Identifier;

export type Tenant = {
  id: TenantID;
  name?: string;
  lokasi?: Lokasi;
};

// =============================================================================================================================

export type FindManyTenantFilter = BaseFindManyFilter & {
  //
};

// =============================================================================================================================
