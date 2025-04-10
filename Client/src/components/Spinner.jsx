import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

const Spinner = ({ className, size = "default" }) => {
  const sizeClass = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  }[size];

  return <Loader2 className={cn(`animate-spin ${sizeClass}`, className)} />;
};

export default Spinner;
