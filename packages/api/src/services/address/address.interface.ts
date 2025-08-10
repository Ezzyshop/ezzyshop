export interface IAddressResponse {
  _id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  user: {
    _id: string;
    full_name: string;
  };
  entrance?: string;
  floor?: string;
  room?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAddressRequest {
  name: string;
  address: string;
  lat: number;
  lng: number;
  entrance?: string;
  floor?: string;
  room?: string;
  note?: string;
}
