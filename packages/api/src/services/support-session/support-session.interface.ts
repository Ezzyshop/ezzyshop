export enum SupportSessionStatus {
  Open = "OPEN",
  Resolved = "RESOLVED",
}

export enum SupportSenderRole {
  Customer = "customer",
  Shop = "shop",
}

export interface ISupportAttachment {
  url: string;
  type: "image";
}

export interface ISupportSession {
  _id: string;
  shop: string;
  user: string;
  subject: string;
  status: SupportSessionStatus;
  lastMessageAt: string;
  lastMessagePreview?: string;
  unreadForUser: number;
  unreadForShop: number;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ISupportMessage {
  _id: string;
  session: string;
  sender: string;
  senderRole: SupportSenderRole;
  text?: string;
  attachments?: ISupportAttachment[];
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ISendMessageRequest {
  sessionId?: string;
  subject?: string;
  text?: string;
  attachments?: ISupportAttachment[];
}

export interface IMessagesResponse {
  session: ISupportSession;
  messages: ISupportMessage[];
}

export interface ISendMessageResponse {
  session: ISupportSession;
  message: ISupportMessage;
}

export interface ISupportUserListItem {
  _id: string;
  lastMessageAt: string;
  unread: number;
  openCount: number;
  totalCount: number;
  user: {
    _id: string;
    full_name: string;
    email?: string;
    phone?: string;
    photo?: string;
  };
}
