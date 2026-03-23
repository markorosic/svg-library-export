# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **File prefix** option: prepend a custom string (e.g. `icon-`) to every exported file name
- **Include nested components** toggle: opt-in recursion into child components (previously always-on)
- **Outline text** checkbox: control whether text layers are converted to paths (`svgOutlineText`)
- **Include layer IDs** checkbox: control whether Figma layer names are written as `id` attributes (`svgIdAttribute`)
- **ZIP filename** field: customise the base name of the exported ZIP file
- Light and dark theme support via Figma's official `themeColors` API — UI colours update automatically when the user switches Figma themes
- Button disabled state during export to prevent duplicate submissions
- Status messages now use icon prefixes (`✓` / `⚠` / `✕`) instead of coloured backgrounds

### Changed

- Panel height increased from 350 px to 480 px to accommodate new options
- UI redesigned with Figma's official CSS variable tokens (`--figma-color-*`) — no hardcoded colours remain
- Section headers changed from `<h2>` elements to uppercase micro-labels, matching Figma's panel design language
- **Export ZIP** promoted to primary (blue) button; **Export Files** demoted to secondary — ZIP is safer for large batches
- `includeNested` now defaults to **off**: the plugin no longer recursively exports sub-components unless explicitly asked
- `convertToFileName` now accepts a prefix parameter; the `illustration-` prefix mentioned in earlier documentation has been removed (use the Prefix field instead)
- Progress bar height reduced to 3 px; count displayed inline with item name
- Plugin title `<h2>` removed from the panel — Figma's chrome already shows the plugin name

### Fixed

- Button intent tracking: replaced fragile dual `addEventListener` + `window.lastClickedButton` pattern with a single module-scoped `_exportIntent` variable
- `updateSelectionInfo` now uses safe DOM methods instead of `innerHTML` to prevent XSS from untrusted layer names
- README naming convention examples updated to match actual code output (no `illustration-` prefix was ever applied by the code)

---

## [0.2.0] — 2025-01-15

### Changed

- Improved `.gitignore` with organised sections and comprehensive exclusion rules
  - Replaced overly broad `*.js` pattern with specific `code.js` (compiled output only)
  - Added TypeScript build artifacts (`*.tsbuildinfo`)
  - Added cross-platform OS metadata files (`Thumbs.db`)
  - Added editor/IDE exclusions (`.vscode/`, `.idea/`, swap files)
  - Added environment file exclusions (`.env`, `.env.local`)
  - Added log file exclusions (`*.log`, `npm-debug.log*`)
- Updated `README.md` project structure to reflect all current files
- Renamed project from `design-asset-exporter` to `svg-library-export` across all config and documentation files

### Added

- `CHANGELOG.md` to track project changes

---

## [0.1.0] — 2025-01-01

Initial implementation.

### Added

- SVG export from selected components or entire page
- Slash-to-hyphen file naming conversion (`Category/Domain/Variant` → `category-domain-variant.svg`)
- Batch export as individual files or ZIP archive (via JSZip)
- Real-time progress bar and status messages
- Live selection info display
