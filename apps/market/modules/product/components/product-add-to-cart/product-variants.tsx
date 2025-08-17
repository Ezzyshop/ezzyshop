import { IProductResponse } from "@repo/api/services/products/index";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";

interface IProps {
  product: IProductResponse;
  selectedVariant?: IProductResponse["variants"][number];
  onVariantSelect: (variant: IProductResponse["variants"][number]) => void;
}

export const ProductVariants = ({
  product,
  selectedVariant,
  onVariantSelect,
}: IProps) => {
  // If no variants exist, don't render anything
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  // Group variants by attribute keys to create organized selection
  const attributeGroups: Record<
    string,
    { value: string; variants: IProductResponse["variants"][number][] }[]
  > = {};

  product.variants.forEach((variant) => {
    Object.entries(variant.attributes).forEach(([key, value]) => {
      if (!attributeGroups[key]) {
        attributeGroups[key] = [];
      }

      const existingGroup = attributeGroups[key].find(
        (group) => group.value === value
      );
      if (existingGroup) {
        existingGroup.variants.push(variant);
      } else {
        attributeGroups[key].push({ value, variants: [variant] });
      }
    });
  });

  // Sort attributes by number of options (hierarchy: most options first)
  const attributeKeys = Object.keys(attributeGroups).sort((a, b) => {
    return (
      (attributeGroups[b]?.length || 0) - (attributeGroups[a]?.length || 0)
    );
  });

  const handleVariantSelect = (
    attributeKey: string,
    attributeValue: string
  ) => {
    // Get current selected attributes
    const currentSelectedAttributes = selectedVariant?.attributes || {};

    // Find the index of the selected attribute in hierarchy
    const selectedAttributeIndex = attributeKeys.indexOf(attributeKey);

    // Start with the new selection
    const newAttributes = {
      ...currentSelectedAttributes,
      [attributeKey]: attributeValue,
    };

    // Auto-select first available options for lower-level hierarchies
    for (let i = selectedAttributeIndex + 1; i < attributeKeys.length; i++) {
      const lowerLevelKey = attributeKeys[i];
      if (!lowerLevelKey) continue;

      // Get currently selected higher-level attributes (including the new selection)
      const higherLevelAttributes: Record<string, string> = {};
      for (let j = 0; j <= selectedAttributeIndex; j++) {
        const higherKey = attributeKeys[j];
        if (higherKey && newAttributes[higherKey]) {
          higherLevelAttributes[higherKey] = newAttributes[higherKey];
        }
      }

      // Find first available option for this lower-level attribute
      const lowerLevelOptions = attributeGroups[lowerLevelKey] || [];
      let firstAvailableOption: string | null = null;

      for (const { value } of lowerLevelOptions) {
        // Check if this option is available given higher-level selections
        const isAvailable = product.variants.some((variant) => {
          // Must have this attribute value
          if (variant.attributes[lowerLevelKey] !== value) {
            return false;
          }

          // Must have stock
          if (variant.quantity <= 0) {
            return false;
          }

          // Must be compatible with all higher-level selections
          return Object.entries(higherLevelAttributes).every(([key, val]) => {
            return !variant.attributes[key] || variant.attributes[key] === val;
          });
        });

        if (isAvailable) {
          firstAvailableOption = value;
          break;
        }
      }

      // If we found an available option, add it to newAttributes
      if (firstAvailableOption) {
        newAttributes[lowerLevelKey] = firstAvailableOption;
      } else {
        // If no option is available, remove this attribute from selection
        delete newAttributes[lowerLevelKey];
      }
    }

    // Find the best variant that matches our new selection (including auto-selected lower levels)
    let bestMatch: IProductResponse["variants"][number] | null = null;
    let maxMatches = -1;

    product.variants.forEach((variant) => {
      // Must have stock
      if (variant.quantity <= 0) {
        return;
      }

      // Count how many of our desired attributes this variant has
      let matches = 0;
      let isCompatible = true;

      Object.entries(newAttributes).forEach(([key, value]) => {
        if (variant.attributes[key] === value) {
          matches++;
        } else if (variant.attributes[key] !== undefined) {
          // Variant has this attribute but with different value - not compatible
          isCompatible = false;
        }
        // If variant doesn't have this attribute at all, it's still compatible
      });

      // Only consider compatible variants
      if (!isCompatible) {
        return;
      }

      // Prefer variants with more matching attributes
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = variant;
      }
    });

    if (bestMatch) {
      onVariantSelect(bestMatch);
    }
  };

  // Check if an attribute value is available based on hierarchical selection
  const isAttributeValueAvailable = (
    attributeKey: string,
    attributeValue: string,
    attributeIndex: number
  ) => {
    // Always allow selection within the same attribute level
    // (don't disable other options in the same attribute group)

    // Get currently selected attributes from higher-level attributes only
    const currentSelectedAttributes = selectedVariant?.attributes || {};
    const higherLevelAttributes: Record<string, string> = {};

    // Only consider attributes that come before this one in hierarchy
    for (let i = 0; i < attributeIndex; i++) {
      const higherKey = attributeKeys[i];
      if (higherKey && currentSelectedAttributes[higherKey]) {
        higherLevelAttributes[higherKey] = currentSelectedAttributes[higherKey];
      }
    }

    // Check if there's any variant that:
    // 1. Has this attribute value
    // 2. Has stock
    // 3. Is compatible with higher-level selections
    return product.variants.some((variant) => {
      // Must have the attribute value we're checking
      if (variant.attributes[attributeKey] !== attributeValue) {
        return false;
      }

      // Must have stock
      if (variant.quantity <= 0) {
        return false;
      }

      // Must be compatible with all higher-level selections
      return Object.entries(higherLevelAttributes).every(([key, value]) => {
        // If variant doesn't have this attribute, it's compatible
        // If variant has this attribute, it must match the selected value
        return !variant.attributes[key] || variant.attributes[key] === value;
      });
    });
  };

  return (
    <div className="space-y-2">
      {attributeKeys.map((attributeKey, attributeIndex) => {
        const options = attributeGroups[attributeKey];

        if (!options) return null;

        return (
          <div key={attributeKey} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 capitalize">
              {attributeKey}
            </h4>
            <div className="flex flex-wrap gap-2">
              {options.map(({ value }) => {
                const isSelected =
                  selectedVariant?.attributes[attributeKey] === value;
                const isAvailable = isAttributeValueAvailable(
                  attributeKey,
                  value,
                  attributeIndex
                );

                return (
                  <Button
                    key={value}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    disabled={!isAvailable}
                    onClick={() => handleVariantSelect(attributeKey, value)}
                    className={cn(
                      "h-9 min-w-16 relative",
                      !isAvailable &&
                        "opacity-50 cursor-not-allowed before:absolute before:content-[''] before:w-full before:h-px before:bg-black/50 before:rotate-25 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2"
                    )}
                  >
                    {value}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
