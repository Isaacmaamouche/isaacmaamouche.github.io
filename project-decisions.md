# Project Decisions

Running log of stack and configuration decisions, with the reasoning behind
them. Newest entries first.

## Stack

- **TanStack Start** + **TanStack Router** — React application framework with
  static prerendering to directory-style HTML for GitHub Pages.
- **React 19** + **TypeScript 7** (native compiler).
- **Vite 8** as the build tool.
- **Tailwind CSS 4** via `@tailwindcss/vite`.

---

## Decisions

### Static prerender: output lives in `dist/client/`

- **What:** `vite.config.ts` configures `tanstackStart({ prerender: { enabled,
  autoSubfolderIndex, crawlLinks, failOnError }, pages: [...] })`. Dynamic routes
  (`/$slug`) are listed explicitly in `pages` so they prerender.
- **Why:** `autoSubfolderIndex` emits directory-style URLs
  (`/example/index.html`) required for clean GitHub Pages paths.
  `crawlLinks` follows in-page links; `failOnError` fails the build on any
  prerender error.
- **Consequence:** TanStack Start splits output into `dist/client/` (static
  site) and `dist/server/`. The GitHub Pages publish directory is
  **`dist/client/`**, not `dist/`.

### ESLint: `@babel/eslint-parser`, not `typescript-eslint`

- **What:** Flat config (`eslint.config.js`). Active plugins: `@eslint/js`
  recommended, `eslint-plugin-prettier`, `eslint-plugin-perfectionist`
  (`recommended-natural`), `eslint-plugin-jsx-a11y`, `eslint-plugin-react`
  (`jsx-key`, `jsx-no-leaked-render`, `jsx-uses-vars`),
  `eslint-plugin-react-hooks`, plus `no-console`. Parsing via
  `@babel/eslint-parser` with `@babel/preset-typescript` + `@babel/preset-react`.
- **Why babel parser:** `typescript-eslint` (umbrella **and**
  `@typescript-eslint/parser`) hard-throws on TypeScript >= 7 —
  `"typescript-eslint does not support TS 7.0."` This project keeps TS 7 (native
  compiler), so no `@typescript-eslint/*` package can load. Tracking:
  https://github.com/typescript-eslint/typescript-eslint/issues/10940
- **Deliberately excluded** (require typescript-eslint or have no source to lint
  here): `typescript-eslint` + all `@typescript-eslint/*` rules,
  `consistent-type-imports`, `vitest`, `testing-library`, `storybook`,
  `formatjs`.
- **Unused vars:** `no-unused-vars` is off for `.ts`/`.tsx` — the babel parser
  can't see type-position usage, so type-only imports read as unused. `tsc` now
  runs `noUnusedLocals` + `noUnusedParameters` (type-aware) and owns unused
  detection; the ESLint rule (with `^_` ignore patterns) stays on for `.js`.
- **Other adaptations for version/runtime compat:**
  - `Link` removed from the `jsx-a11y` component map — TanStack `Link` uses `to`,
    not `href`, so mapping it to `a` triggered false `anchor-is-valid` errors.
  - perfectionist custom `groups` list dropped (used old group names) → preset
    defaults.
  - react-hooks registered manually + its rules spread in; its
    `recommended-latest` config ships a broken legacy `plugins` array under
    ESLint 9 flat config.
- **Trade-off:** No type-aware lint rules (babel parser has no type info); `tsc`
  (`npm run check`) covers types. Revisit `typescript-eslint` once it supports
  TS 7.
- **Install note:** ESLint deps installed with `--legacy-peer-deps` because peer
  ranges reference older TypeScript.
- **Formatting:** Prettier defaults (double quotes, semicolons, sorted
  keys/imports/props) now enforced via `eslint-plugin-prettier`; source was
  auto-formatted with `eslint . --fix`.

### CSS imported as a URL: `import appCss from "~/styles/app.css?url"`

- **What:** `__root.tsx` imports the stylesheet with Vite's `?url` suffix and
  emits it as a `<link>` in the route head:
  `links: [{ href: appCss, rel: "stylesheet" }]`.
- **`~/`** — path alias to `src/` (`tsconfig.json` → `paths: { "~/*":
  ["./src/*"] }`); resolves to `src/styles/app.css`.
- **`?url`** — Vite returns the file's resolved, hashed URL string
  (e.g. `/assets/app-CXxCekb2.css`) instead of the CSS contents. Without it,
  Vite would bundle and auto-inject the CSS.
- **Why:** produces a real `<link rel="stylesheet">` in the prerendered HTML, so
  styles load with **zero JavaScript** (matches the no-JS baseline goal). The
  content hash provides cache-busting.

---

## Scripts

| Script  | Purpose                                  |
| ------- | ---------------------------------------- |
| `dev`   | Vite dev server                          |
| `build` | Static build + prerender                 |
| `preview` | Serve built output                     |
| `check` | `tsc --noEmit` (type checking)           |
| `lint`  | `eslint .`                               |
