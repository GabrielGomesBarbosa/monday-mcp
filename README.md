# Monday.com MCP Server

A Model Context Protocol (MCP) server that provides tools to interact with the Monday.com API. This server enables AI assistants to retrieve board lists, board details, item content, and user information from your Monday.com workspace.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol that enables AI applications to connect to external data sources and tools. MCP servers expose tools, resources, and prompts that can be used by AI assistants like Claude to perform actions and access information.

## Features

- **Board Management**: Retrieve paginated lists of boards from your Monday.com workspace
- **Board Details**: Get detailed information about specific boards with filtered items
- **Item Content**: Fetch detailed content for specific board items including parsed descriptions
- **User Information**: Retrieve information about the currently authenticated user
- **Stdio Transport**: Uses standard input/output for communication (perfect for local development)
- **TypeScript**: Written in TypeScript for type safety and better developer experience
- **Zod Validation**: Uses Zod for schema validation of tool inputs and outputs
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Monday.com account with API access
- Monday.com API token

## Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Set up your Monday.com API token as an environment variable:

```bash
export MONDAY_API_TOKEN="your_api_token_here"
```

Or create a `.env` file in the project root:

```
MONDAY_API_TOKEN=your_api_token_here
```

### Getting Your Monday.com API Token

1. Log in to your Monday.com account
2. Click on your avatar in the bottom left corner
3. Navigate to **Administration** → **API**
4. Generate a new API token or copy an existing one
5. Copy the token and save it securely

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

## Available Tools

The server exposes four tools to interact with Monday.com:

### 1. `monday_get_board_list`

Retrieve a paginated list of boards from your Monday.com workspace.

**Parameters:**
- `limit` (number, optional): Maximum number of boards to return (default: 10)
- `page` (number, optional): Page number for pagination (default: 1)

**Returns:**
- Array of board objects with ID, name, description, item terminology, state, and views

**Example Usage:**
```typescript
// Get first 10 boards
{ limit: 10, page: 1 }

// Get 25 boards from page 2
{ limit: 25, page: 2 }
```

### 2. `monday_get_board_details`

Retrieve detailed information about a specific board with filtered items (assigned to me and ready to start).

**Parameters:**
- `boardId` (string, required): The ID of the board to retrieve details for

**Returns:**
- Board object with filtered items that match the criteria

**Example Usage:**
```typescript
{ boardId: "1234567890" }
```

### 3. `monday_get_board_item_list`

Retrieve detailed content for a specific board item including parsed description text.

**Parameters:**
- `itemId` (string, required): The ID of the item to retrieve content for

**Returns:**
- Item object with id, name, and clean description text (images filtered out)

**Example Usage:**
```typescript
{ itemId: "9876543210" }
```

### 4. `monday_get_me`

Retrieve information about the currently authenticated Monday.com user.

**Parameters:**
- None

**Returns:**
- User object with profile details (id, name, email, etc.)

**Example Usage:**
```typescript
// No parameters needed
{}
```

## Project Structure

```
mat-monday-mcp-server/
├── src/
│   ├── index.ts                      # Main server implementation
│   ├── types.ts                      # Type definitions
│   ├── config/
│   │   └── client.ts                 # Monday.com API client configuration
│   ├── services/
│   │   ├── boards.ts                 # Board-related API operations
│   │   ├── items.ts                  # Item-related API operations
│   │   ├── monday.ts                 # Core Monday.com service
│   │   └── users.ts                  # User-related API operations
│   ├── tools/
│   │   ├── index.ts                  # Tool registry
│   │   ├── get-board-list.ts         # Board list tool
│   │   ├── get-board-details.ts      # Board details tool
│   │   ├── get-board-item-content.ts # Item content tool
│   │   └── get-me.ts                 # Current user tool
│   └── utils/
│       └── content-parser.ts         # Content parsing utilities
├── dist/                             # Compiled JavaScript (generated)
├── package.json                      # Project dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── tsup.config.ts                    # Build configuration
└── README.md                         # This file
```

## How It Works

### Architecture

1. **Server Creation**: The server is created using `McpServer` from `@modelcontextprotocol/sdk`
2. **Tool Registration**: All tools are registered via the central `registerTools` function
3. **Service Layer**: Business logic is separated into service modules (boards, items, users)
4. **Monday.com Client**: API interactions use the official `@mondaydotcomorg/api` SDK
5. **Transport Setup**: The server connects via `StdioServerTransport` for stdio communication
6. **Request Handling**: When a client calls a tool, it executes the corresponding service function

### Services

#### Board Service (`services/boards.ts`)

- `getBoardListPaginated(limit, page)`: Fetches a paginated list of boards
- `getBoardDetailsPaginated(boardId)`: Fetches board details with filtered items

#### Item Service (`services/items.ts`)

- `getBoardItemContent(itemId)`: Fetches item content with parsed description

#### User Service (`services/users.ts`)

- `getMe()`: Fetches current authenticated user information

### Content Parsing

The server includes utilities to parse Monday.com's description format:
- Extracts clean text from Quill-like deltaFormat structures
- Filters out image blocks
- Provides readable text content

## Using with MCP Clients

To use this server with an MCP client (like Claude Desktop or Cursor), you'll need to configure it in your MCP client settings. The server communicates via stdio, so the client needs to spawn the server process.

### Example Client Configuration

For Claude Desktop, add to your `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "monday": {
      "command": "node",
      "args": ["/path/to/mat-monday-mcp-server/dist/index.js"],
      "env": {
        "MONDAY_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

For Cursor, add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "monday": {
      "command": "node",
      "args": ["/path/to/mat-monday-mcp-server/dist/index.js"],
      "env": {
        "MONDAY_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

## Development

### Scripts

- `npm run build` - Compile TypeScript to JavaScript using tsup
- `npm start` - Run the compiled server
- `npm run dev` - Run the server directly with TypeScript (development mode)

### Dependencies

- `@modelcontextprotocol/sdk` - Official MCP SDK for TypeScript/Node.js
- `@mondaydotcomorg/api` - Official Monday.com API SDK
- `zod` - Schema validation library
- `typescript` - TypeScript compiler
- `tsup` - TypeScript bundler for building

### Adding New Tools

To add a new tool:

1. Create a new file in `src/tools/` (e.g., `my-new-tool.ts`)
2. Define a `ToolDefinition` with name, config, and handler
3. Import it in `src/tools/index.ts`
4. Add it to the `tools` array in the `registerTools` function

Example:

```typescript
// src/tools/my-new-tool.ts
import { z } from 'zod'
import type { ToolDefinition } from '../index'

export const myNewTool: ToolDefinition = {
  name: 'monday_my_new_tool',
  config: {
    title: 'My New Tool',
    description: 'Description of what this tool does',
    inputSchema: {
      param: z.string().describe('Description of parameter')
    },
    outputSchema: {
      result: z.any().describe('Result description')
    }
  },
  handler: async (inputs: any) => {
    try {
      // Tool logic here
      return {
        content: [{ type: 'text', text: 'Success message' }],
        structuredContent: { result: {} }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        content: [{ type: 'text', text: `Error: ${errorMessage}` }],
        structuredContent: {
          result: { error: true, type: 'ErrorType', message: errorMessage }
        }
      }
    }
  }
}
```

## Error Handling

All tools include comprehensive error handling:

- Errors are caught and returned in both human-readable format (`content`) and structured format (`structuredContent`)
- Error responses include error type and message
- Network errors, authentication issues, and API errors are handled gracefully

## Learning Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Monday.com API Documentation](https://developer.monday.com/api-reference/docs)
- [Monday.com API SDK](https://github.com/mondaycom/api)

## License

ISC


