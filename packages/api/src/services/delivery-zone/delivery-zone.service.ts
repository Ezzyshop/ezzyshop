import { IData } from '../../utils/interfaces';
import { api } from '../../api';
import { IDeliveryZone } from './delivery-zone.interface';

export class DeliveryZoneService {
  static async getPublicZones(shopId: string): Promise<IDeliveryZone[]> {
    const response = await api.get<IData<IDeliveryZone[]>>(`/delivery-zones/public/${shopId}`);
    return response.data.data;
  }

  static async checkZone(shopId: string, lat: number, lng: number): Promise<boolean> {
    const response = await api.get<{ data: { inZone: boolean } }>(
      `/delivery-zones/public/${shopId}/check`,
      { params: { lat, lng } },
    );
    return response.data.data.inZone;
  }
}
