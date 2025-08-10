declare module "next/navigation" {
  export function usePathname(): string;
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
    prefetch?: (href: string) => void;
  };
  // Using a broad type to avoid importing Next.js specific types
  export function useSearchParams(): URLSearchParams | null;
}
