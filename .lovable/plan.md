# Sticker cutouts, Home nav, readable pink headings

## 1. Add "Home" nav link
**File:** `src/components/sash/Layout.tsx`
- Prepend `["/", "Home"]` to the nav array so it shows as the first item before Aesthetics, For You, Wishlist, Cart, Manifesto. Clicking it returns to `/` (landing page).

## 2. Save the 4 uploaded sketches as project assets
Copy uploads to `src/assets/`:
- `user-uploads://image-10.png` → `src/assets/sticker-pink-dress.png` (strapless pink dress walking — Home left sticker)
- `user-uploads://image-11.png` → `src/assets/sticker-gown-bow.png` (pink-and-black gown with bow — Home right sticker)
- `user-uploads://image-12.png` → `src/assets/sticker-blonde-bow.png` (blonde with pink bow dress — For You)
- `user-uploads://image-13.png` → `src/assets/sticker-ruffle-gown.png` (pink ruffled ball gown on form — Cart)

## 3. Build a reusable "sticker cutout" effect
**New file:** `src/components/sash/StickerCutout.tsx`
A small component that renders a PNG with:
- A thick black "die-cut sticker" outline achieved with multi-direction CSS `drop-shadow` filters (8 stacked 1–2px black shadows in a ring, plus one soft offset shadow for the paper-lift effect). This outlines the *figure itself*, not a rectangle, because the source PNGs have white backgrounds we'll knock out.
- White-background knockout via CSS `mix-blend-mode: multiply` on a wrapper, OR — more reliably — by applying `filter: drop-shadow(...)` directly on a `<img>` whose white background is removed via `mask-image` using the same image as a luminance mask. We'll use the simpler & robust approach: `mix-blend-mode: multiply` on the image itself so the white background blends into our page background (which is the kisses/cream paper, so white disappears naturally), then layer the drop-shadow ring for the sticker border.
- Props: `src`, `alt`, `rotate` (deg, optional tilt for the art-and-craft pasted vibe), `borderWidth` ("thick" | "thin"), `className`.

## 4. Home page — fill the right rectangle with sticker art
**File:** `src/pages/Home.tsx`
- Replace the current right-column framed `heroDream` image with a **collage of two sticker cutouts**: `sticker-pink-dress.png` (slightly tilted left, foreground) and `sticker-gown-bow.png` (tilted right, behind/offset). Both rendered via `StickerCutout` with `borderWidth="thick"` and small rotations (e.g. -6deg and +8deg) for the pasted-craft feel.
- Remove the white/cream `bg-cream` framed card so the stickers float directly on the page background (kisses pattern shows through). Keep the floating ✦ accents.
- The old `heroDream` import and image can be removed from this section.

## 5. For You page — add 3rd sticker, tilted
**File:** `src/pages/ForYou.tsx`
- Add `sticker-blonde-bow.png` near the top of the page (next to the page title or as a side decoration in the hero/intro block) using `StickerCutout` with `rotate={-9}` and `borderWidth="thick"` for a pasted-art vibe.

## 6. Cart page — add 4th sticker, thinner border
**File:** `src/pages/Cart.tsx`
- Add `sticker-ruffle-gown.png` as a decorative sticker (top-right of the cart heading area or as an empty-cart hero accent) using `StickerCutout` with `rotate={6}` and `borderWidth="thin"`.

## 7. Make pink headings readable (outlined text)
**File:** `src/index.css`
- Add a new utility `.text-outlined-ink` that adds a **thin black text-stroke** so pink/script text reads against the kisses background:
  ```css
  .text-outlined-ink {
    -webkit-text-stroke: 0.6px hsl(var(--ink));
    paint-order: stroke fill;
    text-shadow: 0 1px 0 hsl(var(--paper)/0.8);
  }
  ```
- Strengthen `.text-rose-dust` with the same `paint-order: stroke fill` + a 0.5px stroke so it's never "blended into the background."

**Files to apply the new class on:**
- `src/pages/Home.tsx`: "welcome, darling ♡", "tell me everything", "what's your era right now, honey?", "don't know your era yet?"
- `src/pages/ForYou.tsx` and `src/pages/Cart.tsx`: any `font-script` / `text-rose-dust` headings on those pages get `text-outlined-ink` added.

## Technical notes (sticker effect)

The sticker outline uses stacked `drop-shadow` filters on the `<img>`:
```css
filter:
  drop-shadow(1px 0 0 #1a1a1a) drop-shadow(-1px 0 0 #1a1a1a)
  drop-shadow(0 1px 0 #1a1a1a) drop-shadow(0 -1px 0 #1a1a1a)
  drop-shadow(1px 1px 0 #1a1a1a) drop-shadow(-1px -1px 0 #1a1a1a)
  drop-shadow(1px -1px 0 #1a1a1a) drop-shadow(-1px 1px 0 #1a1a1a)
  drop-shadow(2px 4px 6px rgba(0,0,0,0.25));
```
Thick = 1.5–2px ring, Thin = 0.5–1px ring.
`mix-blend-mode: multiply` on the image removes the white PNG background by blending it into the warm paper page background (works because our page is light cream, never pure white). For pages where it sits on a darker section, we wrap in a `bg-paper` zone or skip multiply.

## Out of scope
No database, AI, or routing logic changes beyond adding the Home nav link.