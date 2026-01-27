// Types
interface ExportData {
  name: string;
  fileName: string;
  svg: string;
}

interface ExportOptions {
  exportType: 'selection' | 'page';
}

// Show the plugin UI
figma.showUI(__html__, { width: 400, height: 350 });

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
// Category/Domain/Variant/State -> illustration-category-domain-variant
function convertToFileName(nodeName: string): string {
  // Split by forward slash
  const parts = nodeName.split('/').map(part => part.trim());
  
  // Filter out empty parts and convert to lowercase with hyphens
  const cleanParts = parts
    .filter(part => part.length > 0)
    .map(part => 
      part
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    )
    .filter(part => part.length > 0);
  
  // Join with hyphens
  return cleanParts.join('-');
}

// Get all component nodes from a parent (recursively)
function getComponentNodes(node: SceneNode): SceneNode[] {
  const nodes: SceneNode[] = [];
  
  // Only export components and instances
  if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    nodes.push(node);
  }
  
  // Always recurse into children to find nested components
  if ('children' in node) {
    for (const child of node.children) {
      nodes.push(...getComponentNodes(child));
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
      
      // Get component nodes from selection
      for (const node of selection) {
        nodesToExport.push(...getComponentNodes(node));
      }
    } else {
      // Export entire page
      for (const node of figma.currentPage.children) {
        nodesToExport.push(...getComponentNodes(node));
      }
    }
    
    // Remove duplicates (in case nested export creates duplicates)
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
      
      // Update progress
      figma.ui.postMessage({
        type: 'progress',
        current: i + 1,
        total: nodesToExport.length,
        itemName: node.name
      });
      
      try {
        const svg = await node.exportAsync({ 
          format: 'SVG',
          svgOutlineText: true,
          svgIdAttribute: true
        });
        const svgString = String.fromCharCode(...svg);
        const fileName = convertToFileName(node.name);
        
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
        errors: errors.length > 0 ? errors : undefined
      });
      
      const successMessage = errors.length > 0 
        ? `Exported ${exportData.length} of ${nodesToExport.length} item(s) (${errors.length} failed)`
        : `Successfully exported ${exportData.length} item(s)`;
      
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
