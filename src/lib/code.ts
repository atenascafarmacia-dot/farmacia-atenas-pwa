import { customAlphabet } from "nanoid";
import QRCode from "qrcode";

/**
 * Order code + QR factory.
 *
 * Centralizes how an order's public identifier and its scannable QR are
 * created so the rest of the app never builds either by hand.
 */

// Unambiguous alphabet: excludes 0/O, 1/I/L so codes are easy to read aloud.
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const CODE_LENGTH = 5;
const CODE_PREFIX = "FARM";

const randomCode = customAlphabet(CODE_ALPHABET, CODE_LENGTH);

/** Generates a human-friendly order code, e.g. "FARM-7K9Q2". */
export function createOrderCode(): string {
  return `${CODE_PREFIX}-${randomCode()}`;
}

/** Builds the operator URL that a QR encodes for a given order code. */
function buildOperatorUrl(code: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
  const path = `/operador?code=${encodeURIComponent(code)}`;
  return base ? `${base}${path}` : path;
}

/** Generates the order QR as a PNG Data URL pointing to the operator view. */
export function createOrderQr(code: string): Promise<string> {
  return QRCode.toDataURL(buildOperatorUrl(code), {
    margin: 1,
    width: 320,
    errorCorrectionLevel: "M",
  });
}
