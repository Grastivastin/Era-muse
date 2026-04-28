import { CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  rotate?: number;
  borderWidth?: "thick" | "thin";
  className?: string;
  style?: CSSProperties;
};

/**
 * Renders a PNG as a die-cut sticker:
 *  - white background of the source image is knocked out via mix-blend-mode: multiply
 *  - figure is outlined by stacked black drop-shadows
 *  - optional rotation for a pasted, art-and-craft feel
 */
export default function StickerCutout({
  src,
  alt,
  rotate = 0,
  borderWidth = "thick",
  className = "",
  style,
}: Props) {
  const r = borderWidth === "thick" ? 1.6 : 0.8;
  const ink = "hsl(320 18% 12%)"; // near-ink, never pure black
  const ring = [
    `drop-shadow(${r}px 0 0 ${ink})`,
    `drop-shadow(-${r}px 0 0 ${ink})`,
    `drop-shadow(0 ${r}px 0 ${ink})`,
    `drop-shadow(0 -${r}px 0 ${ink})`,
    `drop-shadow(${r}px ${r}px 0 ${ink})`,
    `drop-shadow(-${r}px -${r}px 0 ${ink})`,
    `drop-shadow(${r}px -${r}px 0 ${ink})`,
    `drop-shadow(-${r}px ${r}px 0 ${ink})`,
    `drop-shadow(3px 6px 8px rgba(40,20,30,0.28))`,
  ].join(" ");

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`select-none pointer-events-none ${className}`}
      style={{
        transform: `rotate(${rotate}deg)`,
        filter: ring,
        mixBlendMode: "multiply",
        ...style,
      }}
    />
  );
}