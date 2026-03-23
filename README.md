# SVG Library Export

A Figma plugin for exporting SVG icon and illustration libraries. It converts Figma's slash-separated component naming into clean, developer-friendly file names and supports batch download as individual files or a ZIP archive.

---

## Figma File Structure

The plugin exports **Components** and **Component Instances** only. Frames, groups, and other layer types are ignored.

### Naming convention

Name your components using forward slashes to create hierarchy:

```
Category / Subcategory / Variant
```

The plugin converts each slash-delimited segment to lowercase, strips non-alphanumeric characters, and joins everything with hyphens:

| Figma layer name | Exported file name |
|---|---|
| `Arrow / Left` | `arrow-left.svg` |
| `Icons / Arrow / Left` | `icons-arrow-left.svg` |
| `Social / Twitter / Filled` | `social-twitter-filled.svg` |
| `Illustration / Empty State / No Results` | `illustration-empty-state-no-results.svg` |

You can add a consistent prefix (e.g. `icon-`) using the **Prefix** field in the plugin — this is applied to every exported file without you needing to rename your Figma layers.

### Recommended file structure

Organise your components on a dedicated page. A flat structure (one level of components, no nesting) works best with the default settings:

```
Page: Icons
├── Component: Arrow / Left
├── Component: Arrow / Right
├── Component: Arrow / Up
├── Component: Arrow / Down
├── Component: Social / Twitter / Filled
└── Component: Social / Twitter / Outline
```

If your components contain sub-components (e.g. a button made of an icon + label), keep **Include nested components** unchecked — the plugin will export each top-level component as a single SVG without drilling into its children.

Enable **Include nested components** only when you intentionally want every nested Component and Instance exported as its own file (useful for deeply decomposed design systems).

---

## Usage

### 1. Select what to export

- **Selected items** (default) — select one or more components on the canvas, then run the plugin. The selection info box shows what will be exported.
- **Entire page** — exports every Component and Instance on the current page regardless of selection.

### 2. Configure the options

| Option | Default | Description |
|---|---|---|
| **Include nested components** | Off | When on, recursively exports components nested inside your selection |
| **Prefix** | _(empty)_ | Prepended to every file name — e.g. `icon-` produces `icon-arrow-left.svg` |
| **ZIP name** | `svg-export` | Base name for the ZIP file — a timestamp is appended automatically |
| **Outline text** | On | Converts text layers to vector paths for consistent cross-platform rendering |
| **Include layer IDs** | On | Adds Figma layer names as `id` attributes in the SVG markup |

### 3. Export

- **Export ZIP** — bundles all SVGs into a single timestamped file (e.g. `icon-library-2025-03-23T10-30-00.zip`). Recommended for large batches since browsers can block many simultaneous downloads.
- **Export Files** — downloads each SVG as a separate file, staggered to avoid browser blocking.

A progress bar shows the current export status. Any items that fail to export are logged in the browser console and a warning message is shown; the remaining items are still exported.

---

## Development

### Prerequisites

- Node.js v16+
- Figma desktop app

### Setup

```bash
npm install
npm run build      # compile TypeScript once
npm run watch      # recompile on save
```

### Load in Figma

1. Open Figma desktop
2. Menu → Plugins → Development → **Import plugin from manifest…**
3. Select `manifest.json` from this directory

---

## Project structure

```
svg-library-export/
├── manifest.json       # Plugin configuration
├── code.ts             # Plugin logic (TypeScript source)
├── code.js             # Compiled output — generated, not committed
├── ui.html             # Plugin panel UI
├── package.json
├── tsconfig.json
└── CHANGELOG.md
```

---

## Troubleshooting

**Nothing is exported**
Ensure your selection contains Components or Instances. Frames and groups alone are not exported.

**Unexpected files in the export**
If sub-components you didn't intend to export appear in the output, uncheck **Include nested components** — this stops the plugin from recursing into children.

**File names look wrong**
Check the Figma layer name. Any character that is not a letter or number is replaced with a hyphen. Leading and trailing hyphens are stripped.

**Browser blocking downloads**
Switch to **Export ZIP** — a single download is far less likely to be blocked than dozens of simultaneous file downloads.

**TypeScript errors after editing**
Run `npm install` to ensure dependencies are present, then `npm run build`.

---

## License

MIT
