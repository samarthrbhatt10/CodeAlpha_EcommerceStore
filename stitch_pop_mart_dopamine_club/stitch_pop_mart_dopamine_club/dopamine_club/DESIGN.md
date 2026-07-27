---
name: Dopamine Club
colors:
  surface: '#14121f'
  surface-dim: '#14121f'
  surface-bright: '#3a3746'
  surface-container-lowest: '#0e0c1a'
  surface-container-low: '#1c1a27'
  surface-container: '#201e2c'
  surface-container-high: '#2b2836'
  surface-container-highest: '#363342'
  on-surface: '#e5e0f3'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e5e0f3'
  inverse-on-surface: '#312f3d'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#ffb1c3'
  on-secondary: '#66002c'
  secondary-container: '#ff4b89'
  on-secondary-container: '#590026'
  tertiary: '#ffffff'
  on-tertiary: '#00363a'
  tertiary-container: '#7df4ff'
  on-tertiary-container: '#006f77'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#ffd9e0'
  secondary-fixed-dim: '#ffb1c3'
  on-secondary-fixed: '#3f0019'
  on-secondary-fixed-variant: '#8f0041'
  tertiary-fixed: '#7df4ff'
  tertiary-fixed-dim: '#00dbe9'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#14121f'
  on-background: '#e5e0f3'
  surface-variant: '#363342'
typography:
  display-xl:
    fontFamily: Syne
    fontSize: 80px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  border-width: 3px
  offset-shadow: '6px 6px 0px #0D0B18'
---

## Brand & Style
The brand personality is high-octane, irreverent, and unapologetically loud. It sits at the intersection of Y2K nostalgia and contemporary Neo-Brutalist digital art. The target audience consists of Gen Z trend-seekers and digital natives who crave tactile, hyper-visual interfaces that feel like a physical toy or a sticker-covered arcade cabinet.

The design system utilizes **Neo-Brutalist Y2K Pop**. This style merges raw structural elements—like heavy borders and offset shadows—with the optimistic, fluid aesthetics of the early 2000s, such as glassmorphism, holographic gradients, and neon glows. Every interaction should trigger a "dopamine hit" through vibrant color shifts, grainy textures, and floating 3D layers.

## Colors
The palette is built on "Electronic Vibrancy." The foundation is **Deep Midnight Indigo**, which provides a high-contrast stage for the neon secondary colors. 

- **Electric Lime (#CCFF00):** Used for primary actions, alerts, and "buy" triggers.
- **Bubblegum Hot Pink (#FF007A):** Reserved for high-energy accents, interactive states, and branding.
- **Cyber Cyan (#00F0FF):** Used for informational elements, links, and secondary buttons.
- **Lavender Cloud (#E0C3FC):** Acts as a softer secondary neutral for glass backgrounds and secondary text.
- **Deep Midnight Indigo (#0D0B18):** The core background and stroke color.

Apply a subtle **6% opacity film grain overlay** across all surfaces to enhance the tactile, retro-digital feel.

## Typography
Typography is a mix of geometric expression and functional clarity. 

- **Headlines:** Syne is used in its extra-bold weight to create a "blocky" and impactful visual hierarchy. Headlines should often use tight tracking and occasional 3px text-strokes in Midnight Indigo.
- **Body:** Plus Jakarta Sans provides a clean, modern contrast to the expressive headlines, ensuring long-form content remains readable amidst the visual noise.
- **Data/UI Labels:** Space Grotesk is used for technical data, prices, and button labels to reinforce the "tech-pop" aesthetic.

## Layout & Spacing
The layout follows a **Fluid Neo-Brutalist** grid. Elements do not shy away from overlapping or breaking out of containers.

- **Grid:** Use a 12-column grid for desktop with 32px gutters. For mobile, use a 4-column grid with 16px gutters.
- **Padding:** Maintain generous internal padding (min 24px) for containers to balance the heavy borders.
- **Offsets:** Use the `offset-shadow` variable to push elements "off" the page, creating a physical 2.5D appearance. Cards and buttons should appear to "click" by translating (4px, 4px) and removing the shadow on active states.

## Elevation & Depth
Depth is created through a "Floating Glass" hierarchy:

1.  **Level 0 (Base):** Deep Midnight Indigo with grain overlay.
2.  **Level 1 (Cards):** Semi-transparent Glassmorphism (Background blur: 20px, Opacity: 10-20%) with a solid 3px border and 6px hard offset shadow.
3.  **Level 2 (Active/Floating):** Vibrant neon backgrounds (Lime/Pink/Cyan) with an outer Glow (20px spread, 30% opacity of the color).
4.  **Holographic Layer:** Use CSS linear-gradients (Cyan to Pink to Lime) at 45 degrees with 0.4 opacity for special badges or "rare" items.

## Shapes
Shapes are exaggerated and chunky. 
- **Containers:** Large page wrappers and sections use `rounded-xl` (24px) to feel substantial.
- **Cards/Buttons:** Standard interactive elements use `rounded-lg` (16px) for a "toy-like" feel.
- **Pills/Badges:** Navigation links, status chips, and decorative stickers use 999px (fully rounded) to maximize the "Pop" aesthetic.

## Components
- **Buttons:** 3px Indigo border, solid neon fill (Electric Lime for Primary, Pink for Secondary). On hover, add a 12px white glow. On click, translate 4px down/right and hide the offset shadow.
- **Cards:** Glassmorphic background with 15% white tint and 30px backdrop blur. Must feature a 3px Midnight Indigo border. 
- **Chips/Badges:** High-contrast small pills. Use Cyber Cyan text on Midnight Indigo for tech specs; use Pink/Lime gradients for "New" or "Hot" tags.
- **Inputs:** Thick borders, inset shadow (3px), and Space Grotesk text. When focused, the border changes to Electric Lime with a matching outer glow.
- **Stickers/Pop-ups:** UI notifications should look like physical stickers—slight rotations (2-3 degrees) and white "die-cut" borders (4px white border outside the 3px indigo border).
- **Lists:** Items separated by heavy 3px horizontal rules. Interactive list items should "pop" out with a neon background color on hover.