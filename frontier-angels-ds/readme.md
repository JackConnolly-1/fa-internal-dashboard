# Frontier Angels Design System

**Brand:** Frontier Angels  
**Category:** Angel investor network / early-stage venture fund  
**Description:** Frontier Angels is an angel investing group that backs early-stage founders at the frontier of innovation. They operate multiple funds (Fund 4, Fund 5) and connect accredited investors with high-potential startups.

---

## Sources

| Source | Path / URL |
|---|---|
| Logo Package | `FrontierAngels_Logo_Package-20260611T193314Z-3-001/` (local mounted folder) |
| Website Copy | `FrontierAngels_Logo_Package-20260611T193314Z-3-001/FrontierAngels_Logo_Package/Website copy/` |

*No Figma link or GitHub codebase was provided. Design system built from logo assets only.*

---

## Project Structure

```
styles.css                   ← Root CSS entry (only @imports)
tokens/
  fonts.css                  ← @font-face / Google Fonts imports ⚠ see font note
  colors.css                 ← --navy-*, --gold-*, --neutral-*, semantic aliases
  typography.css             ← --font-*, --text-*, --weight-*, --leading-*, --tracking-*
  spacing.css                ← --space-*, --radius-*, --z-* tokens
  effects.css                ← --shadow-*, --ease-*, --duration-*, --transition-*
components/core/
  Button.jsx / .d.ts         ← Primary action button (6 variants, 5 sizes)
  Badge.jsx / .d.ts          ← Status badges and category tags (9 variants)
  Card.jsx / .d.ts           ← Content surface / container (7 variants)
  components.card.html       ← Design System tab card
guidelines/
  colors-brand.card.html     ← Brand color swatches
  colors-navy-scale.card.html
  colors-gold-scale.card.html
  colors-neutral-scale.card.html
  colors-semantic.card.html
  type-display.card.html
  type-body.card.html
  type-weights.card.html
  type-pairing.card.html
  spacing-scale.card.html
  spacing-radii.card.html
  effects-shadows.card.html
  brand-logos.card.html
  brand-logo-horizontal.card.html
  brand-fund-logos.card.html
assets/
  logos/                     ← All logo variants (PNG + SVG)
    logo-full-color.png/.svg ← Primary logo (with texture)
    logo-no-texture.svg      ← Clean version (no distress)
    logo-one-color.svg       ← Single-color (navy only)
    logo-no-texture-one-color.png/.svg
    logo-fa-only.png/.svg    ← FA mark without wordmark
    logo-type-only.png/.svg  ← Wordmark without FA mark
    logo-white.png           ← White/reversed version
    logo-horizontal.jpg      ← Horizontal lockup
    email-signature-logo.png
    variants/                ← Group 1–6: layout/arrangement variants
  brand/
    fa-ff4.jpg               ← FA Fund 4 logo
    ff5-logo.png             ← FA Fund 5 logo
    5.png                    ← Fund 5 numeral asset
  photos/
    pjs-headshot.jpg         ← Headshot photo (team member)
```

---

## CONTENT FUNDAMENTALS

### Voice & Tone
- **Direct and confident.** Frontier Angels speaks like an experienced operator, not a pitch deck. No fluff.
- **Community-first.** "We" and "our network" language — this is a collective of angels, not a faceless fund.
- **Aspirational but grounded.** "Frontier" implies bold bets at the edge, but language stays professional and trustworthy.
- **Not corporate.** Avoid stiff finance-speak. Prefer plain English over jargon.

### Casing
- **Headlines:** Title Case for section headers; Sentence case for body/CTA copy.
- **Buttons/CTAs:** ALL CAPS or Title Case (e.g. "INVEST NOW", "Apply for Fund 5").
- **Brand name:** Always "Frontier Angels" (two words, both capitalized). Never "FA" alone in text (FA is mark-only).
- **Fund names:** "Fund 4", "Fund 5" (capitalize Fund).

### Pronoun & Person
- First-person plural ("We invest in...", "Our portfolio...") for brand voice.
- Second-person ("You'll get access...", "Apply today") for CTAs and onboarding.
- No emoji in professional/investor-facing copy.

### Punctuation & Style
- Em dashes (—) for emphasis or parenthetical breaks.
- Oxford comma in lists.
- Periods at end of sentences in body copy; no periods in headlines.
- Numbers under 10 spelled out in body text; numerals for stats and dollar amounts.

### Examples
- ✅ "We back early-stage founders solving hard problems."
- ✅ "Apply to Fund 5 — now open to accredited investors."
- ✅ "$10K minimum check size."
- ❌ "FA is revolutionizing the angel investing space!" (too hype-y)
- ❌ "frontier angels" (lowercase brand name)

---

## VISUAL FOUNDATIONS

### Colors
Two-color brand palette — deep navy + warm gold:
- **Navy `#0C2140`** — primary. Dark, authoritative, trustworthy. Used for all logo text, primary buttons, dark backgrounds, body copy.
- **Gold `#BB8956`** — accent. Warm, approachable, aspirational. Used for the halo icon in the logo, CTAs, highlights.
- **White `#FFFFFF`** — reversed text and backgrounds.
- All three colors appear together in the primary logo: navy letterforms, gold halo, white background.

### Typography
- **Display/Headings:** Bitter (bold slab serif, 700–800 weight). Slab serif connotes stability, tradition, trustworthiness — appropriate for a financial brand. Heavy weight gives authority.
  - ⚠️ *Substitution:* Bitter is the closest Google Fonts match. The exact font from the logo is unidentified. Provide .ttf/.otf files to replace.
- **Body/UI:** Source Sans 3. Clean, neutral, highly legible at small sizes.
- **Mono:** Source Code Pro. For deal terms, numbers, code.
- All-caps + wide letter-spacing used for labels, badges, CTAs.

### Logo System
- Primary mark: "FA" letterforms in a distressed/stamp style, tilted ~8° counterclockwise, with a gold halo floating above.
- The distress texture is intentional — it suggests grit, character, and frontier spirit.
- "FRONTIER ANGELS" wordmark in clean bold slab serif below the mark.
- Five layout variants: stacked (2 vertical), horizontal (3 arrangements), FA-only, wordmark-only.
- Fund sub-brands (Fund 4, Fund 5) use the FA mark in black with a yellow halo and fund number.

### Backgrounds
- **Light:** White `#FFFFFF` (default), Navy-50 `#EDF4FB` (subtle tint).
- **Dark:** Navy-900 `#0C2140` (hero sections, dark cards, footers).
- No gradients, no textures in backgrounds. The texture lives only in the logo mark.
- Full-bleed navy backgrounds work well for hero/feature sections.

### Spacing & Layout
- 4px grid. Standard card padding: 24px. Section spacing: 64–96px.
- Cards: slight shadow (`--shadow-md`), 10px radius. Featured cards add gold border + gold glow.
- No aggressive rounded corners — radius stays ≤ 10px for rectangular elements, pill only for badges/avatars.

### Animation
- Subtle and professional. No bouncy or playful animations.
- Hover: cards lift 2px + shadow deepens. Buttons darken slightly.
- Press state: scale(0.97) for 100ms.
- Easing: cubic-bezier ease-default for most; spring for press/release.
- No auto-playing animations or loops on content.

### Iconography
No icon set was provided in the brand package. See ICONOGRAPHY section below.

### Cards
- Background: white. Border: 1px `--navy-100`. Radius: 10px. Shadow: `--shadow-md`.
- Dark variant: navy-900 background, white text.
- Featured variant: white background, 2px gold border, gold glow shadow.
- Hover: lift 2px + deeper shadow.

### Hover & Press States
- Hover: background darkens (primary), subtle tint appears (secondary/ghost), shadow deepens.
- Press: scale(0.97), 100ms.
- Focus: gold ring (`--shadow-focus` = 3px rgba(187,137,86,0.50)).

### Borders
- Default border: 1px solid `--navy-100` (very light).
- Strong border: `--navy-300`.
- Accent border: `--gold-600`.
- No decorative left-border-only patterns.

### Imagery
- No imagery provided in the brand package beyond the headshot photo.
- Recommend: warm, authentic photography of people and places. Not stock photography.
- Color treatment: natural color, slight warmth. No heavy filters, no B&W unless editorial.

---

## ICONOGRAPHY

No icon set was included in the brand package. Recommendations:
- Use **Lucide** (available via CDN) — clean, 1.5px stroke, geometric. Matches the clean but authoritative brand feel.
- Avoid filled/heavy icons; prefer outlined/stroked icons.
- Icon sizes: 16px (inline), 20px (UI), 24px (feature icons).
- Never use emoji as icons in professional investor-facing contexts.
- Unicode arrows (→ ←) are acceptable in CTAs.

---

## SKILL.md reference
See `SKILL.md` for agent invocation instructions.
