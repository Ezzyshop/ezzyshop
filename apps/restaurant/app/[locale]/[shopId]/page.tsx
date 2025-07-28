import { HomepagePage } from "@/modules/homepage/pages";
import { ICommonParamsAsync } from "@/utils/interfaces";

export default async function HomePage({ params }: ICommonParamsAsync) {
  const { shopId } = await params;

  return <HomepagePage shopId={shopId} />;
}
