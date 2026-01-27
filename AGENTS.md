# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Build
```bash
npm run build
```
Compiles TypeScript (`code.ts`) to JavaScript (`code.js`) using the TypeScript compiler.

### Watch Mode
```bash
npm run watch
```
Automatically recompiles on file changes. Use this during active development to see changes in Figma without manually rebuilding.

### Testing in Figma
After building, load the plugin in Figma:
1. Open Figma desktop app
2. Menu → Plugins → Development → Import plugin from manifest...
3. Select `manifest.json` from this project
4. Run from Menu → Plugins → Development → SVG Library Exporter

### Cleanup
```bash
rm code.js
```
Remove compiled output when needed. The compiled file is tracked in git (not in .gitignore).

## Architecture

### Plugin Structure
Figma plugins run in two isolated contexts that communicate via `postMessage`:

**Plugin Context (`code.ts`)**
- Runs in Figma's sandbox with access to the Figma API
- Can read/traverse the document tree and export nodes
- Has NO access to browser APIs (no Blob, no direct file downloads)
- Must send data to UI for any browser-level operations

**UI Context (`ui.html`)**
- Runs in an iframe with access to browser APIs
- Handles all file downloads using Blob API
- Uses JSZip library (loaded from CDN) for ZIP creation
- Cannot access Figma's document tree

### File Naming Algorithm
The core logic in `convertToFileName()`:
1. Split node name by `/` (e.g., "Category/Domain/Variant")
2. Trim whitespace from each part
3. Convert to lowercase
4. Replace non-alphanumeric with hyphens
5. Remove leading/trailing hyphens
6. Join with hyphens and prepend "illustration-"
7. Result: `illustration-category-domain-variant.svg`

### Export Flow
1. User configures options and clicks Export button
2. UI sends `export-svg` message to plugin
3. Plugin determines nodes to export (selection vs. page)
4. Plugin optionally traverses nested children based on `includeNested` flag
5. Plugin exports each node to SVG with settings:
   - `svgOutlineText: true` (converts text to paths)
   - `svgIdAttribute: true` (preserves layer names as IDs)
6. Plugin sends array of `{name, fileName, svg}` to UI
7. UI downloads files individually OR bundles into timestamped ZIP

### Key Dependencies
- `@figma/plugin-typings`: TypeScript types for Figma Plugin API
- `jszip`: ZIP file creation (loaded via CDN in ui.html, types for code.ts)
- TypeScript compiles to ES2017 CommonJS

## Important Context

### Node Type Filtering
Only these node types are exportable:
- `COMPONENT`
- `FRAME`
- `GROUP`
- `INSTANCE`

When traversing, the plugin checks these types before attempting export.

### Nested Export Behavior
When `includeNested: true`, the plugin recursively traverses children and may find duplicates (same node via multiple paths). Deduplication uses `Array.from(new Set(nodesToExport))`.

### Progress & Error Handling
- Real-time progress updates sent to UI during export loop
- Individual node export failures are caught, logged, and collected
- Plugin continues exporting remaining nodes after failures
- Final status shows partial success if some exports fail

### Network Access
`manifest.json` explicitly allows `https://cdnjs.cloudflare.com` for loading JSZip library. Adding other domains requires updating the manifest.

### File Download Mechanism
The UI uses a trick to distinguish between "Export Files" and "Export ZIP" buttons:
- Both buttons trigger the same export message to plugin
- Click handlers set `window.lastClickedButton` flag
- When plugin returns data, UI checks flag to determine download method
- Individual file downloads are staggered by 100ms to avoid browser blocking

## Common Issues

### TypeScript Compilation
If `npm run build` fails, ensure Node.js v16+ is installed and dependencies are up to date.

### Plugin Not Appearing in Figma
After manifest changes, reimport the plugin in Figma. Changes to `manifest.json` require a reload.

### UI Not Updating
After editing `ui.html`, close and reopen the plugin window in Figma to see changes.

### Multiple Downloads Blocked
Some browsers block multiple simultaneous downloads. The "Export ZIP" option is the workaround.
