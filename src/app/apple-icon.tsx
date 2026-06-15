import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#16a34a",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Cruz horizontal */}
        <div style={{ position: "relative", width: 100, height: 100, display: "flex" }}>
          <div
            style={{
              position: "absolute",
              left: 37,
              top: 0,
              width: 26,
              height: 100,
              background: "white",
              borderRadius: 6,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 37,
              width: 100,
              height: 26,
              background: "white",
              borderRadius: 6,
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
