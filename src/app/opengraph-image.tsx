import { ImageResponse } from "next/og";

// File convention: Next.js renders this to a 1200x630 PNG at build time and
// wires up the og:image / twitter:image meta tags automatically.
export const alt = "Sean O'Reilly — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 64,
            height: 4,
            backgroundColor: "#fb923c",
            marginBottom: 32,
          }}
        />
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>
          Sean O&apos;Reilly
        </div>
        <div style={{ fontSize: 36, color: "#a1a1aa", marginTop: 24 }}>
          Full-Stack Developer
        </div>
        <div style={{ fontSize: 28, color: "#fb923c", marginTop: 16 }}>
          Laravel · Next.js · FastAPI
        </div>
      </div>
    ),
    size,
  );
}
