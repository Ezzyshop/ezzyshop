declare module "next/navigation" {
  export function useParams(): {
    shopId: string;
    locale: string;
  };
}
