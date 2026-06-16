import { Pill } from "lucide-react";

/** Soft category-based tints, alternating brand primary / accent. */
const TINTS = [
  { bg: "bg-primary-50", fg: "text-primary-600" },
  { bg: "bg-accent-100", fg: "text-accent-600" },
] as const;

function tintFor(category?: string): (typeof TINTS)[number] {
  if (!category) return TINTS[0];
  let sum = 0;
  for (let i = 0; i < category.length; i++) sum += category.charCodeAt(i);
  return TINTS[sum % TINTS.length] ?? TINTS[0];
}

interface ProductThumbProps {
  imageUrl: string | null;
  name: string;
  category?: string;
  /** Controls the frame size/aspect (default: square, full width). */
  className?: string;
  /** Icon size for the placeholder. */
  iconClassName?: string;
}

/**
 * Product thumbnail. Renders the real image with a consistent frame
 * (fixed aspect, object-cover, rounded) or an elegant tinted placeholder
 * with a centered line icon when there's no image.
 */
export function ProductThumb({
  imageUrl,
  name,
  category,
  className = "aspect-square w-full",
  iconClassName = "h-1/3 w-1/3",
}: ProductThumbProps) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        className={`${className} rounded-xl object-cover`}
      />
    );
  }

  const tint = tintFor(category);
  return (
    <div
      aria-hidden="true"
      className={`${className} flex items-center justify-center rounded-xl ${tint.bg}`}
    >
      <Pill className={`${iconClassName} ${tint.fg}`} strokeWidth={1.5} />
    </div>
  );
}
