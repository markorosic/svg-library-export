// Types
interface ExportData {
  name: string;
  fileName: string;
  svg: string;
}

interface ExportOptions {
  exportType: 'selection' | 'page';
  includeNested: boolean;
  outlineText: boolean;
  includeIds: boolean;
  filePrefix: string;
  zipName: string;
}

// Show the plugin UI
figma.showUI(__html__, { width: 400, height: 480, themeColors: true });

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'export-svg') {
    await exportSVGLibrary(msg.options);
  } else if (msg.type === 'get-selection-info') {
    updateSelectionInfo();
  }
};

// Update selection info in UI
function updateSelectionInfo() {
  const selection = figma.currentPage.selection;
  const count = selection.length;
  const items = selection.slice(0, 5).map(node => node.name);

  figma.ui.postMessage({
    type: 'selection-info',
    count,
    items,
    hasMore: count > 5
  });
}

// Convert Figma naming structure to file naming
// Category/Domain/Variant -> category-domain-variant (with optional prefix)
function convertToFileName(nodeName: string, prefix: string): string {
  const parts = nodeName.split('/').map(p => p.trim());
  const slug = parts
    .filter(p => p.length > 0)
    .map(p =>
      p
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    )
    .filter(p => p.length > 0)
    .join('-');
  return prefix ? `${prefix.replace(/-+$/, '')}-${slug}` : slug;
}

// Get component/instance nodes from a parent node
// When includeNested is false, stops at the first matching node (no child recursion)
function getComponentNodes(node: SceneNode, includeNested: boolean): SceneNode[] {
  const nodes: SceneNode[] = [];

  if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    nodes.push(node);
    if (!includeNested) return nodes;
  }

  if ('children' in node) {
    for (const child of node.children) {
      nodes.push(...getComponentNodes(child, includeNested));
    }
  }

  return nodes;
}

// Main export function
async function exportSVGLibrary(options: ExportOptions) {
  try {
    figma.ui.postMessage({ type: 'status', message: 'Starting export...', level: 'info' });

    let nodesToExport: SceneNode[] = [];

    // Determine which nodes to export
    if (options.exportType === 'selection') {
      const selection = figma.currentPage.selection;

      if (selection.length === 0) {
        figma.ui.postMessage({
          type: 'status',
          message: 'Please select components to export',
          level: 'warning'
        });
        return;
      }

      for (const node of selection) {
        nodesToExport.push(...getComponentNodes(node, options.includeNested));
      }
    } else {
      // Export entire page
      for (const node of figma.currentPage.children) {
        nodesToExport.push(...getComponentNodes(node, options.includeNested));
      }
    }

    // Remove duplicates
    nodesToExport = Array.from(new Set(nodesToExport));

    if (nodesToExport.length === 0) {
      figma.ui.postMessage({
        type: 'status',
        message: 'No exportable items found',
        level: 'warning'
      });
      return;
    }

    figma.ui.postMessage({
      type: 'status',
      message: `Exporting ${nodesToExport.length} item(s)...`,
      level: 'info'
    });

    const exportData: ExportData[] = [];
    const errors: string[] = [];

    // Export each node
    for (let i = 0; i < nodesToExport.length; i++) {
      const node = nodesToExport[i];

      figma.ui.postMessage({
        type: 'progress',
        current: i + 1,
        total: nodesToExport.length,
        itemName: node.name
      });

      try {
        const svg = await node.exportAsync({
          format: 'SVG',
          svgOutlineText: options.outlineText,
          svgIdAttribute: options.includeIds
        });
        const svgString = String.fromCharCode(...svg);
        const fileName = convertToFileName(node.name, options.filePrefix);

        exportData.push({
          name: node.name,
          fileName: fileName + '.svg',
          svg: svgString
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to export "${node.name}": ${errorMessage}`);
        console.error(`Failed to export ${node.name}:`, error);
      }
    }

    // Send export data to UI
    if (exportData.length > 0) {
      figma.ui.postMessage({
        type: 'export-complete',
        data: exportData,
        zipName: options.zipName || 'svg-export',
        errors: errors.length > 0 ? errors : undefined
      });

      const successMessage = errors.length > 0
        ? `Exported ${exportData.length} of ${nodesToExport.length} item(s) (${errors.length} failed)`
        : `Exported ${exportData.length} item(s)`;

      figma.ui.postMessage({
        type: 'status',
        message: successMessage,
        level: errors.length > 0 ? 'warning' : 'success'
      });
    } else {
      figma.ui.postMessage({
        type: 'status',
        message: 'All exports failed. See console for details.',
        level: 'error'
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    figma.ui.postMessage({
      type: 'status',
      message: `Error: ${errorMessage}`,
      level: 'error'
    });
  }
}

// Initialize: send selection info on startup
updateSelectionInfo();

// Listen for selection changes
figma.on('selectionchange', () => {
  updateSelectionInfo();
});
