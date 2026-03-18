import { useUserContext } from "@repo/contexts/user-context/user.context";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { Card } from "@repo/ui/components/ui/card";

export const UserProfileCard = () => {
  const { user } = useUserContext();

  if (!user) return null;

  return (
    <Card className="bg-card rounded-lg p-4 flex flex-row items-center gap-3 shadow-none border-0">
      <Avatar className="size-12">
        <AvatarImage src={user.photo ?? undefined} />
        <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <h3 className="text-lg font-medium">{user.full_name}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {user.phone ?? user.email}
        </p>
      </div>
    </Card>
  );
};
