/**
 * MCP Greeting Server
 * 
 * This is a simple Model Context Protocol (MCP) server that demonstrates
 * how to create an MCP server with a tool that can be called by AI assistants.
 * 
 * MCP servers expose "tools" that AI assistants can use to perform actions
 * or retrieve information. This server provides a "greet" tool that returns
 * a personalized greeting with the current date and time.
 */

// Import the McpServer class - this is the main class for creating MCP servers
// It handles all the MCP protocol communication and tool management
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

// Import StdioServerTransport - this handles communication via standard input/output (stdio)
// Stdio is a common way for MCP servers to communicate with clients (like AI assistants)
// The client spawns the server process and communicates through stdin/stdout
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';


import { registerTools } from './tools';

/**
 * Create a new MCP server instance
 * 
 * The server needs a name and version to identify itself to clients.
 * This information is sent to the client when they connect.
 */
export const server = new McpServer({
  name: 'mat-monday-server',  // The name of this server (used for identification)
  version: '0.0.1'            // The version of this server
});

/**
 * Type definitions for tool creation (Express-like pattern)
 */
export type ToolName = Parameters<typeof server.registerTool>[0];
export type ToolConfig = Parameters<typeof server.registerTool>[1];
export type ToolHandler = Parameters<typeof server.registerTool>[2];

export type ToolDefinition = {
  name: ToolName;
  config: ToolConfig;
  handler: ToolHandler;
};

async function main() {
  registerTools(server)

  /**
   * Set up the transport layer
   * 
   * The transport layer is how the server communicates with clients.
   * StdioServerTransport uses standard input/output (stdin/stdout) for communication.
   * 
   * This is a common pattern for MCP servers:
   * 1. The client (like an AI assistant) spawns this server process
   * 2. They communicate through stdin (standard input) and stdout (standard output)
   * 3. Messages are sent as JSON-RPC 2.0 protocol messages
   */
  const transport = new StdioServerTransport();

  // Connect the server to the transport
  // This starts the server listening for incoming requests
  // The 'await' keyword waits for the connection to be established before continuing
  await server.connect(transport);
}

try {
  await main()

  /**
   * Log a message to indicate the server is ready
   * 
   * Note: We use console.error instead of console.log because:
   * - stdout is used for MCP protocol communication
   * - stderr (console.error) is for logging/debugging messages
   * - This prevents our log messages from interfering with the MCP protocol messages
   */
  console.error('MCP Greeting Server is running and ready to accept requests via stdio.');
} catch (error) {
  console.error('[Error] Error to run MCP Greeting Server', error);
}

