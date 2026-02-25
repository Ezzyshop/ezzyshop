declare module "next/navigation" {
  export function useParams<T extends string>(): Record<T, string>;
}
