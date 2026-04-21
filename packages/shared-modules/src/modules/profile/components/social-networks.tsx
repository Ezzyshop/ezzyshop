import { useShopContext } from "@repo/contexts/shop-context/shop.context";
import {
  FacebookIcon,
  InstagramIcon,
  SendIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@repo/ui/components/icons/index";
import { useMemo } from "react";

const socialIconMap = {
  telegram: SendIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  youtube: YoutubeIcon,
};

export const SocialNetworks = () => {
  const { social_links } = useShopContext();

  const availableSocialLinks = useMemo(
    () =>
      Object.entries(social_links).filter(
        (entry): entry is [keyof typeof socialIconMap, string] =>
          Boolean(entry[1]) && entry[0] in socialIconMap
      ),
    [social_links]
  );

  if (!availableSocialLinks.length) return null;

  return (
    <div className="flex items-center justify-center gap-3 px-4">
      {availableSocialLinks.map(([network, url]) => {
        const Icon = socialIconMap[network];
        const href = url.startsWith("http") ? url : `https://${url}`;

        return (
          <a
            key={network}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={network}
            className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground transition-colors hover:text-primary hover:border-primary"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
};
