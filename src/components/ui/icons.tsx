// Create a custom icon component to reduce lucide-react bundle size
import { LucideProps } from "lucide-react";

// Only import specific icons you need
export { ArrowLeft, Eye, EyeOff, Plus, ChevronsUpDown } from "lucide-react";

// For frequently used icons, create optimized versions
export const ChevronDown = (props: LucideProps) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      d="m6 9 6 6 6-6"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
