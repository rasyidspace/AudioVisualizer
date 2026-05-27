# RULES.md

## Core Principle
Build fast, clean, production-ready code with minimal unnecessary processing and token usage.

---

# General Rules

- Do NOT over-engineer.
- Do NOT generate unnecessary abstractions.
- Do NOT create excessive comments.
- Do NOT explain obvious code.
- Do NOT generate placeholder features unless requested.
- Do NOT generate mock backend unless requested.
- Do NOT create unnecessary files.
- Do NOT create duplicate components.
- Do NOT add analytics/tracking.
- Do NOT add authentication unless requested.
- Do NOT add SEO setup unless requested.
- Do NOT generate unit tests.
- Do NOT generate integration tests.
- Do NOT generate e2e tests.
- Do NOT run automatic tests.
- Do NOT create CI/CD configs.
- Do NOT generate Docker unless requested.
- Do NOT create unnecessary environment variables.
- Do NOT install unused dependencies.
- Keep dependencies minimal.

---

# Performance Rules

- Prioritize lightweight rendering.
- Avoid unnecessary re-renders.
- Use simple state management.
- Prefer local component state when possible.
- Avoid expensive animations.
- Optimize for smooth 60fps UI.
- Use lazy loading when useful.
- Minimize bundle size.

---

# Design Rules

- Maintain clean modern UI.
- Use floating glassmorphism panels minimally.
- Keep spacing consistent.
- Prefer rounded-2xl design language.
- Keep animations subtle and smooth.
- Avoid visual clutter.
- Maintain premium aesthetic.

---

# Code Style

- Use functional components only.
- Use TypeScript.
- Keep components modular.
- Avoid giant files.
- Prefer reusable UI blocks.
- Keep logic readable and concise.
- Avoid deeply nested structures.
- Prefer composition over complexity.

---

# Tailwind Rules

- Use Tailwind utility classes directly.
- Avoid unnecessary custom CSS files.
- Use responsive classes efficiently.
- Keep class naming clean.

---

# Audio Visualizer Rules

- Use Web Audio API for audio analysis.
- Use requestAnimationFrame for rendering loop.
- Pause rendering when audio is stopped.
- Keep visualizer GPU-friendly.
- Avoid heavy particle counts.
- Optimize canvas redraws.
- Use efficient math calculations.

---

# YouTube Rules

- Use YouTube IFrame API only.
- Do NOT attempt to extract raw audio from YouTube.
- Use embedded playback safely.
- Sync visualizer using playback timing only.

---

# Animation Rules

- Use Framer Motion sparingly.
- Avoid excessive motion effects.
- Keep transitions under 400ms.
- Use smooth easing.

---

# Theme Rules

- Support dark mode and light mode.
- Persist theme using localStorage.
- Avoid unnecessary theme recalculations.

---

# Mobile Rules

- Mobile-first responsive design.
- Ensure touch-friendly controls.
- Avoid heavy effects on mobile.
- Optimize layout spacing for small screens.

---

# File Structure

/src
/components
/visualizers
/hooks
/lib
/types
/styles

Keep structure simple and scalable.

---

# Token Efficiency Rules

- Generate only requested features.
- Avoid verbose explanations.
- Avoid repeating code.
- Avoid generating unused helper functions.
- Avoid unnecessary refactors.
- Keep responses concise.
- Prefer direct implementation.

---

# Default Stack

- React
- Next.js
- TypeScript
- TailwindCSS
- Framer Motion
- Web Audio API
- Canvas API or Three.js

---

# Final Goal

Create a fast, elegant, minimal, immersive audio visualizer web app with clean architecture and efficient rendering.