import { HomepagePage } from "@/modules/homepage/pages/homepage.page";

interface IProps {
  params: Promise<{ shopId: string }>;
}

export default async function HomePage({ params }: IProps) {
  const { shopId } = await params;
  return <HomepagePage shopId={shopId as string} />;
}
