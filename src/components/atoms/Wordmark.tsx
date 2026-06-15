import { strings } from "@/lib/strings";

/** Subtle inline olive-sprig mark (no raster assets). */
function OliveMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      fill="none"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path
        d="M5 20C9 16 13 10 19 5"
        className="stroke-primary-600"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      <ellipse
        cx="11"
        cy="12.5"
        rx="3.6"
        ry="1.7"
        transform="rotate(-34 11 12.5)"
        className="fill-primary-500"
      />
      <ellipse
        cx="15.5"
        cy="8"
        rx="3.6"
        ry="1.7"
        transform="rotate(-34 15.5 8)"
        className="fill-primary-500"
      />
      <circle cx="6" cy="18.5" r="1.6" className="fill-accent-600" />
    </svg>
  );
}

/** "Farmacia Atenas" wordmark: olive mark + display type. */
export function Wordmark() {
  return (
    <span className="flex items-center gap-2" aria-label={strings.brand.name}>
      <OliveMark />
      <span className="font-display text-lg leading-none tracking-tight text-ink">
        {strings.brand.word1}{" "}
        <span className="font-semibold text-primary-700">{strings.brand.word2}</span>
      </span>
    </span>
  );
}
