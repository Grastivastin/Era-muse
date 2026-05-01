import { CSSProperties, useId } from "react";

type Props = {
  src: string;
  alt: string;
  rotate?: number;
  borderWidth?: "thick" | "thin";
  className?: string;
  style?: CSSProperties;
};

/**
 * True die-cut sticker:
 *  1. SVG <feColorMatrix> luminance-to-alpha makes the WHITE background of the source
 *     PNG actually transparent (so drop-shadow outlines the FIGURE, not a rectangle).
 *  2. A second SVG filter draws an ink-coloured outline ring around the now-transparent
 *     figure using morphology dilation, then composites the original on top — that's
 *     the "stickers cut from a magazine" border.
 *  3. A soft offset shadow gives the lifted-paper feel.
 */
export default function StickerCutout({
  src,
  alt,
  rotate = 0,
  borderWidth = "thick",
  className = "",
  style,
}: Props) {
  const id = useId().replace(/[:]/g, "");
  const ringW = borderWidth === "thick" ? 3 : 1.6;

  return (
    <div
      className={`relative inline-block select-none pointer-events-none ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          {/* Knock the white background out via luminance-to-alpha,
              then dilate the alpha to draw an ink ring around the figure. */}
          <filter id={`sticker-${id}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            {/* SourceGraphic -> alpha where dark pixels are opaque, white is transparent */}
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                     -1 -1 -1 0 3"
              result="figureAlpha"
            />
            {/* Dilate that alpha to make the outline ring */}
            <feMorphology in="figureAlpha" operator="dilate" radius={ringW} result="ringAlpha" />
            {/* Tint the ring near-ink colour */}
            <feFlood floodColor="#231019" floodOpacity="1" result="ringColor" />
            <feComposite in="ringColor" in2="ringAlpha" operator="in" result="ring" />
            {/* Re-build the source with white knocked out */}
            <feComposite in="SourceGraphic" in2="figureAlpha" operator="in" result="figureNoBg" />
            {/* Soft drop shadow for the paper-lift */}
            <feGaussianBlur in="ringAlpha" stdDeviation="3" result="shadowBlur" />
            <feOffset in="shadowBlur" dx="3" dy="6" result="shadowOffset" />
            <feColorMatrix
              in="shadowOffset"
              type="matrix"
              values="0 0 0 0 0.16
                      0 0 0 0 0.08
                      0 0 0 0 0.12
                      0 0 0 0.35 0"
              result="softShadow"
            />
            <feMerge>
              <feMergeNode in="softShadow" />
              <feMergeNode in="ring" />
              <feMergeNode in="figureNoBg" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="block w-full h-auto"
        style={{ filter: `url(#sticker-${id})` }}
      />
    </div>
  );
}