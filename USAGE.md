# Quick Usage Guide

## Setup in Figma

1. Open Figma desktop app
2. Menu → Plugins → Development → Import plugin from manifest...
3. Select `manifest.json` from this project folder
4. Plugin is now available in your Plugins menu

## Using the Plugin

### Step 1: Name Your Components

Use forward slashes in Figma to organize components:

```
Games/Slot
Casino Features/Instant Withdrawal
Promotions/Welcome Bonus/Active
```

### Step 2: Select Items to Export

- Select specific components, frames, or groups
- OR choose "Export entire page" in the plugin

### Step 3: Configure Export Options

**Export Type:**
- ☑️ Export selected items (only your selection)
- ⬜ Export entire page (all items on page)

**Options:**
- ☑️ Include nested items (recursive export)

### Step 4: Export

- **Export Files**: Downloads each SVG separately
- **Export ZIP**: Downloads all SVGs in one ZIP file

## File Naming Examples

| Figma Name | Output File |
|------------|-------------|
| `Games/Slot` | `illustration-game-slot.svg` |
| `Casino Features/Instant Withdrawal` | `illustration-casino-features-instant-withdrawal.svg` |
| `Icons/Navigation/Home` | `illustration-icons-navigation-home.svg` |

## Tips

1. **Organize in Figma**: Use forward slashes to create a clear hierarchy
2. **Consistent Naming**: Follow the Category/Domain/Variant pattern
3. **Batch Export**: Use "Export ZIP" for large batches to avoid multiple download prompts
4. **Nested Components**: Enable "Include nested items" to export children
5. **Progress Tracking**: Watch the progress bar for status updates

## Common Workflows

### Export Icon Library
1. Select all icon components
2. Check "Include nested items"
3. Click "Export ZIP"
4. Unzip and use in your project

### Export Single Component
1. Select one component
2. Click "Export Files"
3. SVG downloads immediately

### Export Entire Design System
1. Navigate to your components page
2. Don't select anything
3. Choose "Export entire page"
4. Click "Export ZIP"
5. All components exported at once

## Troubleshooting

**Nothing exports?**
- Make sure items are components, frames, or groups (not basic shapes)
- Check that you have items selected (or "Export entire page" is chosen)

**File names wrong?**
- Verify Figma names use forward slashes: `Category/Domain`
- Check for special characters that convert to hyphens

**Downloads blocked?**
- Browser may block multiple downloads
- Use "Export ZIP" instead

**Plugin slow?**
- Large batches (100+) take time
- Export in smaller batches if needed
