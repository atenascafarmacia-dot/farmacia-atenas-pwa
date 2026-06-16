import { strings } from "@/lib/strings";

interface WordmarkProps {
  /** Rendered logo size in px (square). Defaults to the top-bar size. */
  size?: number;
  className?: string;
}

/**
 * Brand logo (Farmacia Atenas badge). The asset is a circular badge on a white
 * square, so `rounded-full` clips it down to just the badge.
 */
export function Wordmark({ size = 36, className = "" }: WordmarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt={strings.brand.name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`rounded-full ${className}`}
    />
  );
}
