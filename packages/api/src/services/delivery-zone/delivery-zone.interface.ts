export interface IDeliveryZone {
  _id: string;
  shop: string;
  name: string;
  polygon: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  status: 'Active' | 'Inactive' | 'Deleted';
  createdAt: string;
  updatedAt: string;
}
