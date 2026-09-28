import { BrandImage } from "./BrandImage";

const SIZES = {
  sm: "h-10 w-10",
  md: "h-12 w-12 sm:h-14 sm:w-14",
  lg: "h-16 w-16 sm:h-20 sm:w-20",
  xl: "h-24 w-24 sm:h-32 sm:w-32",
};

export function DualLogo({
  size = "md",
  className = "",
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const box = `${SIZES[size]} shrink-0 object-contain`;
  return (
    <span className={`inline-flex shrink-0 items-center gap-2 sm:gap-3 ${className}`}>
      <BrandImage brand="sukhf" alt="SU Knowledge Hub Foundation" className={box} decoding="async" />
      <span aria-hidden className="font-display text-lg font-light text-muted-foreground">
        ×
      </span>
      <BrandImage brand="sues" alt="Sultan-ul-Uloom Education Society" className={box} decoding="async" />
    </span>
  );
}
