---
name: "Incudef Institutional Design System"
description: "An institutional, culturally grounded design system pairing deep navy (#03045E) and neutral light surfaces with warm terracotta accents."
---

## Overview

The **Incudef** design system balances institutional authority with cultural warmth. Designed for administrative portals, data tables, and authentication flows, it pairs a crisp, neutral-white and soft-gray canvas with a deep navy primary (`#03045E`) and a terracotta accent (`#C85A32`) inspired by clay, roots, and tradition. The aesthetic is **Corporate / Modern** with editorial typographic poise—calm, trustworthy, and effortless to scan.

## Colors

The palette anchors on **Institutional Blue** (`#03045E`) for primary actions, navigation, and key headings, supported by clean neutral whites and soft grays for maximum legibility in forms and data tables. **Terracotta** (`#C85A32`) serves as the warm accent for highlights, badges, and secondary calls to action without overwhelming the view.

```yaml
colors:
  accent: "#C85A32"
  on-accent: "#0F0F0F"
  ochre: "#D99B26"
  success: "#1E7E4E"
  warning: "#B86E00"
  error: "#B42318"
  light:
    primary: "#03045E"
    on-primary: "#FFFFFF"
    primary-container: "#E8EAFF"
    on-primary-container: "#03045E"
    surface: "#F8F9FA"
    surface-container: "#FFFFFF"
    surface-container-low: "#F1F3F5"
    on-surface: "#1A1D24"
    on-surface-variant: "#525866"
    outline: "#D0D5DD"
    outline-variant: "#E4E7EC"
  dark:
    primary: "#BAC3FF"
    on-primary: "#03045E"
    primary-container: "#1E2278"
    on-primary-container: "#E8EAFF"
    surface: "#0F1117"
    surface-container: "#181B24"
    surface-container-low: "#12151C"
    on-surface: "#F1F3F5"
    on-surface-variant: "#98A2B3"
    outline: "#344054"
    outline-variant: "#1D2939"
```

## Typography

This system pairs **PT Serif** for institutional headlines with **PT Sans** for crisp, legible forms, navigation, and data tables, and **Spline Sans Mono** for codes or technical identifiers.

```yaml
typography:
  display-lg:
    fontFamily: "PT Serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 48px
    letterSpacing: -0.5px
  display-lg-mobile:
    fontFamily: "PT Serif"
    fontSize: 30px
    fontWeight: 700
    lineHeight: 36px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: "PT Serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40px
    letterSpacing: -0.25px
  headline-md:
    fontFamily: "PT Serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
    letterSpacing: 0px
  title-lg:
    fontFamily: "PT Sans"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 28px
    letterSpacing: 0px
  title-md:
    fontFamily: "PT Sans"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 24px
    letterSpacing: 0px
  body-lg:
    fontFamily: "PT Sans"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-md:
    fontFamily: "PT Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  body-sm:
    fontFamily: "PT Sans"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0.1px
  label-lg:
    fontFamily: "PT Sans"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: "PT Sans"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 16px
    letterSpacing: 0.25px
  label-sm:
    fontFamily: "PT Sans"
    fontSize: 11px
    fontWeight: 700
    lineHeight: 14px
    letterSpacing: 0.25px
  mono-md:
    fontFamily: "Spline Sans Mono"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
```

## Layout & Spacing

Desktop layouts use a **12-column grid** (max-width 1280px) with 24px gutters. For authentication (`AuthLayout`), the viewport splits into two balanced columns on desktop (`lg:grid-cols-2` or 50/50): an institutional/cultural visual panel on the left and a centered, distraction-free form container on a neutral surface on the right. On mobile, the visual panel collapses into a compact header or hides to keep the form front and center.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section: 48px
  page-margin: 24px
```

## Elevation & Depth

Hierarchy relies on **tonal layers** and **low-contrast outlines** (`outline-variant` `#E4E7EC`) rather than heavy drop shadows. Form cards and data tables sit on crisp white (`surface-container`) against a soft gray (`surface` `#F8F9FA`) background, keeping focus on content and inputs.

## Shapes

Corners are clean and approachable—moderately rounded for cards and inputs, with pill or subtle rounding for badges and buttons.

```yaml
rounded:
  sm: 4px
  DEFAULT: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
```

## Motion & Micro-interaction

Motion is crisp and understated. Interactive states (button hover, input focus) respond within 150ms, while surface transitions settle smoothly in 250ms.

```yaml
motion:
  state-change:
    duration: 150ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 250ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 150ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
```

## Voice & Content Strategy

- **Tone of voice:** Institutional, clear, and respectful—warm without being casual.
- **Capitalisation:** Sentence case for all headings, labels, and buttons.
- **Button and action labels:** Action-oriented verb phrases in Spanish (e.g., "Iniciar sesión", "Enviar enlace de recuperación", "Volver al inicio").
- **Error states:** Plain-spoken guidance explaining what happened and how to fix it.

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Input Field** → `@components/input-field.html`: `input-field-text`, `input-field-icon`
- **Typography** → `@components/typography.html`: `typography-display`, `typography-body`, `typography-label`
