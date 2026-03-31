import { useEffect, useState } from "react";

interface InstrumentIconProps {
  alt: string;
  fallback: string;
  iconUrl?: string | null;
  containerClassName?: string;
  imageClassName?: string;
  fallbackClassName?: string;
}

export function InstrumentIcon({
  alt,
  fallback,
  iconUrl,
  containerClassName,
  imageClassName,
  fallbackClassName,
}: InstrumentIconProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [iconUrl]);

  return (
    <div className={containerClassName}>
      {iconUrl && !failed ? (
        <img
          src={iconUrl}
          alt={alt}
          className={imageClassName}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={fallbackClassName}>{fallback}</span>
      )}
    </div>
  );
}
