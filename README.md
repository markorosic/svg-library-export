# Figma SVG Export Plugin

A Figma plugin that exports SVG libraries from your Figma designs with automatic file naming conversion and batch download capabilities.

## Overview

This plugin streamlines the process of exporting SVG files from Figma designs. It automatically converts Figma's hierarchical naming structure (e.g., "Category/Domain/Variant") into clean, developer-friendly file names (e.g., "illustration-category-domain-variant.svg").

## Features

- **Smart Naming Convention**: Automatically converts Figma naming structure to lowercase, hyphen-separated file names
- **Flexible Export Options**: Export selected items or entire pages
- **Nested Export Support**: Option to include nested components and frames
- **Batch Export**: Export multiple SVGs at once as individual files or as a ZIP archive
- **Real-time Progress**: Visual progress indicators during export
- **Selection Info**: Live display of selected items count and names
- **Error Handling**: Graceful error handling with detailed feedback

## Naming Convention

### Figma Structure
Use forward slashes to organize your components in Figma:
```
Category / Domain / Variant / State
```

### Exported File Names
The plugin automatically converts to:
```
illustration-{category}-{domain}-{variant}.svg
```

### Examples

| Figma Name | Exported File Name |
|------------|-------------------|
| `Games/Slot` | `illustration-game-slot.svg` |
| `Casino Features/Instant Withdrawal` | `illustration-casino-features-instant-withdrawal.svg` |
| `Promotions/Welcome Bonus/Active` | `illustration-promotions-welcome-bonus-active.svg` |

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Figma desktop app

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd figma-svg-export-plugin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

### Running in Figma

1. Open Figma desktop app
2. Go to Menu → Plugins → Development → Import plugin from manifest...
3. Select the `manifest.json` file from this project
4. The plugin will now be available in your Plugins menu

### Development Workflow

To automatically rebuild when files change:
```bash
npm run watch
```

## Usage

### Basic Export

1. Open a Figma file
2. Select the components, frames, or groups you want to export
3. Run the plugin from Menu → Plugins → Development → SVG Library Exporter
4. Choose your export options:
   - **Export selected items**: Export only what you've selected
   - **Export entire page**: Export all exportable items on the current page
   - **Include nested items**: Recursively export nested components
5. Click "Export Files" for individual SVG downloads or "Export ZIP" for a bundled archive

### Export Options

#### Export Type
- **Selected items**: Only exports the items you have selected in Figma
- **Entire page**: Exports all components, frames, and groups on the current page

#### Include Nested Items
When enabled, the plugin will recursively traverse and export nested components within selected items.

#### Export Format
- **Export Files**: Downloads each SVG as a separate file
- **Export ZIP**: Bundles all SVGs into a single timestamped ZIP file

### SVG Export Settings

The plugin exports SVGs with the following settings:
- **Outline text**: Text is converted to vector paths (ensures consistent rendering)
- **Include IDs**: Layer names are included as ID attributes (useful for referencing elements)

## Project Structure

```
figma-svg-export-plugin/
├── manifest.json       # Plugin configuration
├── code.ts            # Main plugin logic (TypeScript)
├── code.js            # Compiled plugin code
├── ui.html            # Plugin user interface with download handlers
├── package.json       # Node dependencies (including JSZip)
├── tsconfig.json      # TypeScript configuration
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Technical Details

### Architecture

The plugin consists of two parts:

1. **Plugin Code (code.ts)**:
   - Runs in Figma's sandbox with access to the Figma API
   - Handles node traversal, SVG export, and naming conversion
   - Communicates with UI via postMessage

2. **UI Code (ui.html)**:
   - Runs in an iframe with access to browser APIs
   - Handles file downloads using Blob API
   - Creates ZIP archives using JSZip library

### File Naming Algorithm

1. Split Figma node name by forward slashes
2. Trim whitespace from each part
3. Convert to lowercase
4. Replace non-alphanumeric characters with hyphens
5. Remove leading/trailing hyphens
6. Join with hyphens and prepend "illustration-"
7. Append ".svg" extension

## Troubleshooting

### No items are being exported
- Ensure you have selected components, frames, groups, or instances
- Check that "Export selected items" is chosen if you want to export your selection
- Verify that the items are actually exportable (not just layers)

### Downloads not working
- Make sure you're using a modern browser or the Figma desktop app
- Check your browser's download settings and permissions
- Some browsers may block multiple file downloads - try using "Export ZIP" instead

### File names are incorrect
- Verify that your Figma components follow the naming convention: `Category/Domain/Variant`
- Check for special characters that might be converted to hyphens
- The plugin automatically converts everything to lowercase

### Plugin is slow with large exports
- Large batches (100+ items) may take time to export
- The progress bar shows real-time status
- Consider exporting in smaller batches if needed

### TypeScript compilation errors
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Ensure you're using Node.js v16 or higher

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT
