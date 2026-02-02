## Project Summary
Blige is a professional-grade research workspace designed for scholars. It features a neural synthesis engine to process academic literature, clarify theories, and assist in high-precision writing. Now upgraded to Deep Intelligence System v3.0.

## Tech Stack
- Frontend: Next.js 15 (App Router), React, Tailwind CSS
- UI Components: Lucide React, Framer Motion, Radix UI (via shadcn/ui)
- Content: React Markdown, Remark GFM
- Theme: Next Themes (Light/Dark support)
- Search Engine: Tavily (v2.0 integration)

## Architecture
- `src/app`: Next.js App Router pages and API routes
- `src/components`: React components including the main `Chat` interface
- `src/lib`: Utility functions and shared logic (including `agent-config.ts` for system prompts)
- `src/hooks`: Custom React hooks

## User Preferences
- Preferred light/dark theme support
- Clean, academic-focused aesthetic with minimal distractions
- Functional components with TypeScript
- High-depth academic output (Standard, Comprehensive, Advanced levels)

## Project Guidelines
- Follow existing naming conventions and styling patterns
- Maintain smooth animations using Framer Motion
- Ensure high visual accuracy in UI updates
- Adhere to Deep Intelligence System v3.0 standards for academic rigor

## Common Patterns
- Expandable sections with `AnimatePresence` and `motion.div`
- Responsive design for both desktop and mobile views
- Professional, high-contrast typography
- Multi-layered search strategy (4-6 queries per section) using Tavily
- Hierarchical source evaluation (Tier 1-3)
