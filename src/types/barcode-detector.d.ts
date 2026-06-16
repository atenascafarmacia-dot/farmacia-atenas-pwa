// Minimal ambient types for the Barcode Detection API, which isn't part of the
// TypeScript DOM lib yet. Used by the operator QR scanner. The API ships in
// Chromium-based browsers (Android Chrome especially); callers must feature-detect
// `window.BarcodeDetector` before use.

export {};

declare global {
  interface DetectedBarcode {
    rawValue: string;
    format: string;
  }

  interface BarcodeDetectorOptions {
    formats?: string[];
  }

  class BarcodeDetector {
    constructor(options?: BarcodeDetectorOptions);
    static getSupportedFormats(): Promise<string[]>;
    detect(source: CanvasImageSource): Promise<DetectedBarcode[]>;
  }

  interface Window {
    BarcodeDetector?: typeof BarcodeDetector;
  }
}
