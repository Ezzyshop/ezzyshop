import { BranchStatus } from "./branch.enum";

export interface IBranchResponse {
  _id: string;
  shop: string;
  name: {
    uz: string;
    ru?: string;
    en?: string;
  };
  address: {
    address: string;
    lat: number;
    lng: number;
  };
  status: BranchStatus;
  pickup_enabled: boolean;
  delivery_enabled?: boolean;
  notes?: string;
}
