# Design System Specification: Neon Noir Performance

## 1. Overview & Creative North Star
### The North Star: "The Synthetic Architect"
This design system is built for high-performance developer environments where speed meets cinematic depth. We are moving away from the "flat dashboard" aesthetic toward a **Neon Noir Editorial** experience. It treats the UI not as a collection of boxes, but as a multi-tonal terminal.

**Key Visual Pillars:**
*   **Intentional Asymmetry:** Break the predictable grid. Use varying column widths and staggered content blocks to create a rhythmic, editorial flow that feels engineered, not templated.
*   **Chromative Depth:** We utilize a "Neon-on-Onyx" approach. By layering deep blacks with vibrant purples and magentas, we create a sense of infinite workspace depth.
*   **High-Contrast Scale:** Dramatically different font sizes between Display and Body text create an authoritative hierarchy that guides the eye through complex technical data.

---

## 2. Colors & Tonal Architecture
The palette is rooted in absolute performance (`background: #0e0e0e`) and punctuated by high-energy synthetic accents.

### The Palette
*   **Primary (The Signal):** `primary: #e6ffc6` — Used for high-priority actions and "success" states.
*   **Secondary (The Pulse):** `secondary: #ccbdff` — Vibrant purples for logical grouping and secondary highlights.
*   **Tertiary (The Spark):** `tertiary: #ffaedf` — Magenta accents for specific interactive "hotspots" and specialized features.
*   **Surface Hierarchy:** 
    *   `surface_container_lowest`: `#000000` (Deepest wells)
    *   `surface_container_low`: `#131313` (Standard sectioning)
    *   `surface_container_highest`: `#262626` (Elevated interactive cards)

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Layout boundaries must be achieved through background shifts.
*   *Correct:* A card using `surface_container_highest` sitting on a `surface` background.
*   *Incorrect:* A card with a grey `#484848` border.

### The Glass & Gradient Rule
To achieve the "Neon Noir" energy, use **Glassmorphism** for floating overlays (Modals, Tooltips).
*   **Formula:** `surface_variant` at 60% opacity + `backdrop-filter: blur(12px)`.
*   **Signature Textures:** For Hero CTAs, use a subtle linear gradient from `secondary` to `secondary_dim` at a 135-degree angle to provide a metallic, high-end sheen.

---

## 3. Typography
The typography system is a dialogue between the technical precision of **Space Grotesk** and the human readability of **Manrope**.

*   **Space Grotesk (Display & Headline):** Used for all data-heavy headers and labels. Its geometric construction reinforces the "Developer-Focused" vibe. Use `display-lg` (3.5rem) for hero statements to command attention.
*   **Manrope (Body & Title):** Used for long-form reading and descriptive text. It softens the "brutalist" edges of the Grotesk headers, ensuring the interface remains accessible for long sessions.
*   **Hierarchy Note:** Label-sm (`0.6875rem` in Space Grotesk) should be used for technical metadata and micro-copy, always in `on_surface_variant` to keep the UI clean.

---

## 4. Elevation & Depth
In this system, elevation is a product of light and layering, not structural lines.

### The Layering Principle
Depth is achieved by "stacking" tones. 
*   **Base:** `surface_dim` (#0e0e0e).
*   **Mid-Ground:** `surface_container_low` (#131313) for primary content areas.
*   **Fore-Ground:** `surface_container_highest` (#262626) for active, clickable cards.

### Ambient Shadows & Glows
*   **Shadows:** When a "floating" effect is required (e.g., a dropdown), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0,0,0, 0.4)`.
*   **Accent Glows:** Icons and active state indicators should utilize a `drop-shadow` rather than a box shadow to create a "Neon Pulse."
    *   *Example:* `filter: drop-shadow(0 0 4px #7d52ff);` for purple icons.

### The "Ghost Border" Fallback
If accessibility requires a container boundary, use the **Ghost Border**: `outline_variant` at **15% opacity**. It should be barely perceptible, serving as a suggestion of a container rather than a hard wall.

---

## 5. Components

### Buttons
*   **Primary:** Background `primary` (#e6ffc6), Text `on_primary_fixed` (#284700). High contrast, high visibility. Radius: `md` (0.375rem).
*   **Secondary (The Neon Variant):** Transparent background, `secondary` text, and a `secondary` 1px Ghost Border (20% opacity). On hover, add a subtle glow.

### Minimal Stroked Icons
All icons must be 1.5px or 2px stroke width. Never use filled icons.
*   **Colors:** Cycle through `secondary_dim` and `tertiary_dim`.
*   **Glow:** Apply a 4px blur glow in the icon's respective color to simulate a "live wire" effect.

### Input Fields
*   **Base:** `surface_container_highest` background with `none` border.
*   **Focus State:** Transition the background to `surface_bright` and add a bottom-only 2px border of `secondary`.

### Cards & Lists
**Strict Rule:** No dividers. Separate list items using 12px or 16px of vertical white space. For cards, distinguish them solely by using `surface_container_low` against the `background`.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins (e.g., 80px left, 40px right) to create editorial tension.
*   **Do** use `secondary` (purple) and `tertiary` (magenta) as functional signifiers for different data streams.
*   **Do** leverage the `display-lg` type for impact; don't be afraid of large, "wasteful" typography.

### Don't
*   **Don't** use standard #000000 or #FFFFFF for text. Use the `on_surface` and `on_surface_variant` tokens to maintain the multi-tonal dark theme.
*   **Don't** use hard-edged, high-opacity shadows. They break the "Neon Noir" atmospheric feel.
*   **Don't** use 100% opaque borders. They clutter the high-performance aesthetic and create visual "noise."