import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { boardListTool } from './get-board-list';
import { boardDetailsTool } from './get-board-details';
import { boardItemContentTool } from './get-board-item-content';
import { getMeTool } from './get-me';

/**
 * Tool Registry
 * 
 * This is the central place where all tools are collected and registered.
 * Similar to Express router pattern where you mount all routes in one place.
 * 
 * To add a new tool:
 * 1. Create a new file in src/tools/ (e.g., my-tool.ts)
 * 2. Export a ToolDefinition from that file
 * 3. Import it here and add it to the tools array
 */

/**
 * Register all tools with the server
 * 
 * @param server - The MCP server instance to register tools with
 * 
 * This function acts like app.use(router) in Express:
 * - It takes the server instance
 * - Iterates through all tool definitions
 * - Registers each tool with the server
 */
export function registerTools(server: McpServer) {
  // Collect all tool definitions
  const tools = [
    boardListTool,
    boardDetailsTool,
    boardItemContentTool,
    getMeTool,
  ];
  
  // Register each tool with the server
  for (const tool of tools) {
    server.registerTool(tool.name, tool.config, tool.handler);
    console.error(`✓ Registered tool: ${tool.name}`);
  }
  
  console.error(`\nTotal tools registered: ${tools.length}`);
}
