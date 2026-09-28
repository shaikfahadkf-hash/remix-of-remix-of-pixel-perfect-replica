import { useState, type ImgHTMLAttributes } from "react";

export const BRAND_IMAGES = {
  sukhf: "/branding/sukhf-logo.png",
  sues: "/branding/sues-logo.png",
} as const;

type BrandImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  brand: keyof typeof BRAND_IMAGES;
};

export function BrandImage({ brand, alt, onError, ...props }: BrandImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      {...props}
      src={failed ? "/branding/logo-fallback.svg" : BRAND_IMAGES[brand]}
      alt={alt}
      onError={(event) => {
        onError?.(event);
        if (!failed) setFailed(true);
      }}
    />
  );
}