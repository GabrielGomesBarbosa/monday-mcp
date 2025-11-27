# MCP Greeting Server

A simple Model Context Protocol (MCP) server that demonstrates how to create an MCP server with a single tool. This server provides a `greet` tool that returns a greeting message along with the current date and time.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that enables AI applications to connect to external data sources and tools. MCP servers expose tools, resources, and prompts that can be used by AI assistants like Claude to perform actions and access information.

## Features

- **Simple Greeting Tool**: Returns a friendly greeting with the current date and time
- **Stdio Transport**: Uses standard input/output for communication (perfect for local development)
- **TypeScript**: Written in TypeScript for type safety and better developer experience
- **Zod Validation**: Uses Zod for schema validation of tool inputs and outputs

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

## Building

Compile TypeScript to JavaScript:

```bash
npm run build
```

This will create the compiled JavaScript files in the `dist/` directory.

## Running the Server

### Production Mode

After building, run the compiled server:

```bash
npm start
```

### Development Mode

Run the server directly with TypeScript (no build step required):

```bash
npm run dev
```

The server will start and listen for MCP requests via stdio (standard input/output).

## The Greet Tool

The server exposes a single tool called `greet`:

- **Name**: `greet`
- **Description**: Returns a greeting with current date and time
- **Input**: None (no parameters required)
- **Output**: 
  - `greeting`: A friendly greeting message
  - `dateTime`: Current date and time in ISO format

### Example Response

```json
{
  "greeting": "Hello! Welcome to the MCP server.",
  "dateTime": "2025-01-15T10:30:45.123Z"
}
```

## Project Structure

```
node-mcp-first/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## How It Works

1. **Server Creation**: The server is created using `McpServer` from `@modelcontextprotocol/sdk`
2. **Tool Registration**: The `greet` tool is registered with input/output schemas defined using Zod
3. **Transport Setup**: The server connects via `StdioServerTransport` for stdio communication
4. **Request Handling**: When a client calls the `greet` tool, it returns a greeting and the current date/time

## Using with MCP Clients

To use this server with an MCP client (like Claude Desktop or Cursor), you'll need to configure it in your MCP client settings. The server communicates via stdio, so the client needs to spawn the server process.

### Example Client Configuration

For Cursor, add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "greeting-server": {
      "command": "node",
      "args": ["/path/to/node-mcp-first/dist/index.js"]
    }
  }
}
```

## Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled server
- `npm run dev` - Run the server directly with ts-node (development mode)

### Dependencies

- `@modelcontextprotocol/sdk` - Official MCP SDK for TypeScript/Node.js
- `zod` - Schema validation library
- `typescript` - TypeScript compiler
- `ts-node` - Run TypeScript directly (dev dependency)

## Learning Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Specification](https://modelcontextprotocol.io/specification)

## License

ISC


