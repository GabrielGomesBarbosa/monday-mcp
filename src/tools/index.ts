import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { greetTool } from './greet';
import { weatherTool } from './weather';

/**
 * Tool Registry
 * 
 * This is the central place where all tools are collected and registered.
 * Similar to Express router pattern where you mount all routes in one place.
 * 
 * To add a new tool:
 * 1. Create a new file in src/tools/ (e.g., myTool.ts)
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
    greetTool,
    weatherTool,
  ];
  
  // Register each tool with the server
  for (const tool of tools) {
    server.registerTool(tool.name, tool.config, tool.handler);
    console.error(`✓ Registered tool: ${tool.name}`);
  }
  
  console.error(`\nTotal tools registered: ${tools.length}`);
}
