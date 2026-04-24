import { ContactSellerChatPage } from "@repo/shared-modules/modules/profile/pages/contact-seller/contact-seller-chat.page";

interface IProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ContactSellerChat({ params }: IProps) {
  const { sessionId } = await params;
  return <ContactSellerChatPage sessionId={sessionId} />;
}
