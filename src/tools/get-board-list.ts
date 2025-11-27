/**
 * Monday.com Get Board List Tool
 * 
 * Retrieves a paginated list of boards from Monday.com.
 */

import { z } from 'zod'
import type { ToolDefinition } from '../index'
import { getBoardListPaginated } from '../services/boards'

export const boardListTool: ToolDefinition = {
  name: 'monday_get_board_list',
  config: {
    title: 'Get Monday.com Board List',
    description: 'Retrieve a paginated list of boards from your Monday.com workspace. Returns board information including ID, name, description, item terminology, state, and views.',
    inputSchema: {
      limit: z.number()
        .optional()
        .default(10)
        .describe('Maximum number of boards to return (default: 10)'),
      page: z.number()
        .optional()
        .default(1)
        .describe('Page number for pagination (default: 1)')
    },
    outputSchema: {
      result: z.any().describe('Array of board objects or error object')
    }
  },
  handler: async (inputs: any) => {
    try {
      const { limit = 10, page = 1 } = inputs
      const boards = await getBoardListPaginated(limit, page)

      const boardList = boards.map(b => `• ${b.name} (ID: ${b.id})`).join('\n')
      const pluralSuffix = boards.length === 1 ? '' : 's'

      return {
        content: [{
          type: 'text',
          text: `✓ Retrieved ${boards.length} board${pluralSuffix} (page ${page}, limit ${limit})\n\n${boardList}`
        }],
        structuredContent: {
          result: boards
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      return {
        content: [{
          type: 'text',
          text: `✗ Failed to retrieve board list: ${errorMessage}`
        }],
        structuredContent: {
          result: {
            error: true,
            type: 'BoardListError',
            message: errorMessage
          }
        }
      }
    }
  }
}
