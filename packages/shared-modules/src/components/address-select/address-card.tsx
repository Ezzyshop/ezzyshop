import { IAddressResponse } from "@repo/api/services/address/address.interface";
import { LocationIcon } from "@repo/ui/components/icons/index";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";
import { RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { AddressDeleteButton } from "./address-delete-button";
import { cn } from "@repo/ui/lib/utils";

interface IProps {
  address: IAddressResponse;
  isEditMode?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export const AddressCard = ({ address, isEditMode = false, disabled = false, disabledReason }: IProps) => {
  return (
    <Card className={cn("p-4 border-none shadow-none", disabled && "opacity-50")}>
      <CardContent className="flex items-center gap-2 px-0">
        <Label
          htmlFor={disabled ? undefined : address._id}
          className={cn("flex items-start gap-2 flex-grow", disabled && "cursor-not-allowed")}
        >
          <LocationIcon className="size-4 min-w-4 fill-primary" />
          <div className="flex-grow">
            <h2 className="text-sm font-medium">{address.name}</h2>
            <p className="text-sm text-muted-foreground">{address.address}</p>
            {disabled && disabledReason && (
              <p className="text-xs text-destructive mt-0.5">{disabledReason}</p>
            )}
          </div>
        </Label>
        {isEditMode ? (
          <AddressDeleteButton id={address._id} />
        ) : (
          <RadioGroupItem
            value={address._id}
            id={address._id}
            disabled={disabled}
            className="w-5 h-5 border-primary bg-transparent [&>span>svg]:w-3 [&>span>svg]:h-3"
          />
        )}
      </CardContent>
    </Card>
  );
};
