import { IData, IPaginatedData } from "../../utils/interfaces";
import { api } from "../../api";
import {
  IMessagesResponse,
  ISendMessageRequest,
  ISendMessageResponse,
  ISupportSession,
} from "./support-session.interface";

export class SupportSessionService {
  static async listSessions(
    shopId: string,
    params?: { page?: number; limit?: number }
  ): Promise<IPaginatedData<ISupportSession>> {
    const response = await api.get(`/support-sessions/${shopId}`, { params });
    return response.data;
  }

  static async getSession(
    shopId: string,
    sessionId: string
  ): Promise<IData<ISupportSession>> {
    const response = await api.get(`/support-sessions/${shopId}/${sessionId}`);
    return response.data;
  }

  static async getMessages(
    shopId: string,
    sessionId: string,
    params?: { limit?: number; before?: string }
  ): Promise<IData<IMessagesResponse>> {
    const response = await api.get(
      `/support-sessions/${shopId}/${sessionId}/messages`,
      { params }
    );
    return response.data;
  }

  static async sendMessage(
    shopId: string,
    body: ISendMessageRequest
  ): Promise<IData<ISendMessageResponse>> {
    const response = await api.post(`/support-sessions/${shopId}`, body);
    return response.data;
  }
}
