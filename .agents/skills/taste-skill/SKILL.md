---
name: design-taste-frontend
description: Anti-slop frontend skill for landing pages, portfolios, and redesigns. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. Real design systems when applicable, audit-first on redesigns, strict pre-flight check.
---

# tasteskill: Anti-Slop Frontend Skill

> Landing pages, portfolios, and redesigns. Not dashboards, not data tables, not multi-step product UI.
> Every rule below is **contextual**. None of it fires automatically. First read the brief, then pull only what fits.

---

## 0. BRIEF INFERENCE (Read the Room Before Anything Else)

Before touching code or tweaking dials, **infer what the user actually wants**. Most LLM design output is bad because the model jumps to a default aesthetic instead of reading the room.

### 0.A Read these signals first
1. **Page kind** - landing (SaaS / consumer / agency / event), portfolio (dev / designer / creative studio), redesign (preserve vs overhaul), editorial / blog.
2. **Vibe words** the user used - "minimalist", "calm", "Linear-style", "Awwwards", "brutalist", "premium consumer", "Apple-y", "playful", "serious B2B", "editorial", "agency-y", "glassy", "dark tech".
3. **Reference signals** - URLs they linked, screenshots they pasted, products they named, brands they're competing with.
4. **Audience** - B2B procurement panel vs. design-conscious consumer vs. recruiter scanning a portfolio. The audience picks the aesthetic, not your taste.
5. **Brand assets that already exist** - logo, color, type, photography. For redesigns, these are starting material, not optional input (see Section 11).
6. **Quiet constraints** - accessibility-first audiences, public-sector, regulated industries, trust-first commerce, kids' products. These constraints OVERRIDE aesthetic preference.

### 0.B Output a one-line "Design Read" before generating
Before any code, state in one line: **"Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <design system or aesthetic family>."**

### 0.C If the brief is ambiguous, ask one question, do not guess
Ask exactly **one** clarifying question - never a multi-question dump - and only when the design read genuinely diverges.

### 0.D Anti-Default Discipline
Do not default to: AI-purple gradients, centered hero over dark mesh, three equal feature cards, generic glassmorphism on everything, infinite-loop micro-animations everywhere, Inter + slate-900. These are the LLM defaults. Reach past them deliberately based on the design read.

---

## 1. THE THREE DIALS (Core Configuration)

After the design read, set three dials. Every layout, motion, and density decision below is gated by these.

* **`DESIGN_VARIANCE: 8`** - 1 = Perfect Symmetry, 10 = Artsy Chaos
* **`MOTION_INTENSITY: 6`** - 1 = Static, 10 = Cinematic / Physics
* **`VISUAL_DENSITY: 4`** - 1 = Art Gallery / Airy, 10 = Cockpit / Packed Data

**Baseline:** `8 / 6 / 4`. Use these unless the design read overrides them.

---

## 2. BRIEF → DESIGN SYSTEM MAP

### 2.A When to reach for a real design system (use official packages)
- Microsoft / enterprise SaaS / engineering: `@fluentui/react-components`
- IBM-style B2B / enterprise analytics: `@carbon/react`
- Modern accessible React foundation: `@radix-ui/themes`
- Modern SaaS where you own the components: `shadcn/ui`
- Tailwind-based modern SaaS / AI engineering: Tailwind v4 utilities + `dark:` variant

---

## 3. DEFAULT ARCHITECTURE & CONVENTIONS

### 3.A Stack
* Framework: React with Vite or Next.js.
* Styling: Tailwind CSS v4.
* Viewport Stability: NEVER use `h-screen` for full-height Hero sections. ALWAYS use `min-h-[100dvh]` to prevent layout jumping on mobile.
* Icons: `@phosphor-icons/react`, `hugeicons-react`, `@radix-ui/react-icons`, `@tabler/icons-react`. Standardize `strokeWidth` globally (1.5 or 2.0).

---

## 4. DESIGN ENGINEERING DIRECTIVES (Anti-Slop Bias Correction)

### 4.1 Typography
* Sans font choices: `Geist`, `Cabinet Grotesk`, `Segoe UI`, `Fira Sans`, `Satoshi`.
* NEVER mix random serif words into sans headlines.
* Italic descender clearance: add `leading-[1.1]` and padding reserve when using italic display type.

### 4.2 Color Calibration
* Max 1 accent color. Saturation < 80% by default.
* **THE LILA RULE:** The "AI Purple / Blue glow" aesthetic is strictly banned as default. Use neutral industrial bases (Slate / Zinc / Navy) with high-contrast singular accents (Electric Blue, Emerald, Burnt Orange).
* **Color Consistency Lock:** Once an accent color is chosen for a page, it is used on the WHOLE page.

### 4.3 Layout & Materiality
* Centered Hero / H1 sections are avoided when variance is high. Prefer Split Screen (50/50) or left-aligned layouts.
* Use cards ONLY when elevation communicates real hierarchy. Otherwise group with subtle borders or negative space.
* **Shape Consistency Lock:** Pick ONE corner-radius scale for the page and stick to it (all-sharp or all-soft 8px-12px).

### 4.4 Form & Feedback Discipline
* Label ABOVE input. Helper text optional. Error text BELOW input.
* No placeholder-as-label. Ever.
* Form inputs, focus rings, helper text, and error text must all pass WCAG AA contrast (4.5:1 minimum).
* Button contrast: clear visible label with 4.5:1 minimum contrast.

### 4.5 The Anti-Slop Ban List
1. Em-dashes and en-dashes banned in copy text.
2. Section-numbering eyebrows (`001 · Capabilities`) banned.
3. Version footers on marketing pages banned.
4. Three-equal-card feature rows banned by default.
5. AI-purple and mesh blob gradients banned by default.
6. Hand-rolled decorative SVG illustrations banned by default.
7. Div-based fake product screenshots banned.
