import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

interface IProps {
  text: string;
  children: React.ReactNode;
}

export const CopyableText = ({ text, children }: IProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const getIcon = () => {
    if (isCopied) {
      return <CheckIcon className="w-4 h-4 text-primary" />;
    }

    return (
      <CopyIcon
        className="w-4 h-4 cursor-pointer text-primary"
        onClick={handleCopyText}
      />
    );
  };

  return (
    <p className="flex items-center gap-2">
      {children}

      {text && getIcon()}
    </p>
  );
};
