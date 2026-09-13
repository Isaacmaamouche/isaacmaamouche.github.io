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

### `no-undef` disabled for TypeScript files

- **What:** `no-undef` is turned off for `.ts`/`.tsx` in the ESLint config,
  alongside `no-unused-vars`.
- **Why:** Same root cause — `@babel/eslint-parser` lacks type information, so
  TypeScript type identifiers (`type Foo`, `interface Bar`, generic parameters)
  are flagged as undefined. `tsc` already catches actual undefined references.
- **Trade-off:** None. Both `no-undef` and `no-unused-vars` are fully covered
  by `tsc` for TypeScript files.

### MDX compilation via `@mdx-js/rollup`

- **What:** MDX files are compiled to React components at build time using
  `@mdx-js/rollup` in `vite.config.ts`, with `remark-frontmatter` to strip
  YAML frontmatter during compilation.
- **Why:** Vite-native MDX support. `remark-frontmatter` prevents the MDX
  compiler from choking on `---` blocks — frontmatter is already parsed
  separately by `gray-matter` at content-index generation time.
- **Alternative considered:** TanStack Start Content Collections. Rejected
  because the project requires colocated React components, local asset imports,
  and explicit hydration — features that need direct MDX compilation control.

### Content index is generated code with MDX imports

- **What:** `scripts/generate-content-index.ts` scans `content/` folders,
  validates metadata, and emits `src/content/generated-content.ts` — a TypeScript
  module with `import` statements for each MDX section file. Vite then bundles
  these imports like any other module.
- **Why:** Avoids filesystem reads at request time. MDX files become part of the
  Vite module graph, enabling tree-shaking, HMR, and correct asset resolution
  for colocated imports.
- **Consequence:** `generated-content.ts` is gitignored (like `routeTree.gen.ts`).
  Both `dev` and `build` scripts run `content:generate` first.
  The file is excluded from ESLint (auto-generated, formatting not meaningful).

### Build-time and runtime content types are separate

- **What:** `content-schema.ts` exports two type families:
  - Build-time (`ContentSection`, `ContentPage`, `ContentIndex`) — use file
    paths, consumed by the generate script.
  - Runtime (`RuntimeContentSection`, `RuntimeContentPage`,
    `RuntimeContentIndex`) — use `ComponentType`, consumed by route components.
- **Why:** The generate script runs in Node (no React), while route components
  need actual component references. Keeping them separate avoids `any` casts
  and keeps both sides type-safe.

### CSS imported as a URL: `import appCss from "@/styles/app.css?url"`

- **What:** `__root.tsx` imports the stylesheet with Vite's `?url` suffix and
  emits it as a `<link>` in the route head:
  `links: [{ href: appCss, rel: "stylesheet" }]`.
- **`@/`** — path alias to `src/` (`tsconfig.json` → `paths: { "@/*":
["./src/*"] }`); resolves to `src/styles/app.css`.
- **`?url`** — Vite returns the file's resolved, hashed URL string
  (e.g. `/assets/app-CXxCekb2.css`) instead of the CSS contents. Without it,
  Vite would bundle and auto-inject the CSS.
- **Why:** produces a real `<link rel="stylesheet">` in the prerendered HTML, so
  styles load with **zero JavaScript** (matches the no-JS baseline goal). The
  content hash provides cache-busting.

### No route loader — content accessed via static import

- **What:** `_content/$slug.tsx` has no `loader`. Both the component and `head`
  call `findPage(slug)` directly from the static `contentIndex` import.
  The component throws `notFound()` for invalid slugs.
- **Why:** A loader that returns the full `page` object fails — Seroval
  (TanStack Start's SSR serializer) cannot serialize MDX component references
  in `page.sections` (`SerovalUnsupportedTypeError`). Returning only
  `{ meta }` from the loader worked but added indirection for no real gain,
  since `head` can access `params` directly.
- **Consequence:** `.find()` runs twice per page (component + head).
  Negligible on a single-digit array.

### Per-route document titles via `head`

- **What:** Content routes set `<title>` from `params.slug` via `.find()`
  in the route's `head` function, falling back to `cardLabel`. The root route
  provides the default title `"Portfolio"`.
- **Why:** Each page gets a distinct browser tab title. Format is bare page name
  (e.g. `"Contact me"`), no site suffix.

### Not-found handling: in-app component + static 404.html

- **What:** Root route has a `notFoundComponent` (minimal "Page not found" +
  home link). `public/404.html` is a standalone static page for GitHub Pages.
- **Why:** Two different 404 paths — in-app `notFound()` triggers the React
  component (client-side nav or prerender); GitHub Pages serves `404.html` for
  paths that have no prerendered file.

---

## Scripts

| Script             | Purpose                                           |
| ------------------ | ------------------------------------------------- |
| `dev`              | Generate content index + Vite dev server          |
| `build`            | Generate content index + static build + prerender |
| `preview`          | Serve built output                                |
| `lint:ts`          | `tsc --noEmit` (type checking)                    |
| `lint:js`          | `eslint .`                                        |
| `lint`             | `lint:js` + `lint:ts`                             |
| `content:generate` | Scan content folders, validate, emit typed index  |
| `content:validate` | Validate content without generating               |
