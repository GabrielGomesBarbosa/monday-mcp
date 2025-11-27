/**
 * Monday.com Get Board Details Tool
 * 
 * Retrieves detailed information about a specific board with filtered items.
 */

import { z } from 'zod'
import type { ToolDefinition } from '../index'
import { getBoardDetailsPaginated } from '../services/boards'

export const boardDetailsTool: ToolDefinition = {
  name: 'monday_get_board_details',
  config: {
    title: 'Get Monday.com Board Details',
    description: 'Retrieve detailed information about a specific board including filtered items (assigned to me and ready to start). Returns board information with items that match the specified criteria.',
    inputSchema: {
      boardId: z.string().describe('The ID of the board to retrieve details for (required)')
    },
    outputSchema: {
      result: z.any().describe('Board details object with filtered items or error object')
    }
  },
  handler: async (inputs: any) => {
    try {
      const { boardId } = inputs
      const boards = await getBoardDetailsPaginated(boardId)

      if (boards.length === 0) {
        return {
          content: [{
            type: 'text',
            text: `⚠ No board found with ID: ${boardId}`
          }],
          structuredContent: {
            result: null
          }
        }
      }

      const board = boards[0]
      const itemCount = board.items_page?.items?.length || 0
      const itemList = board.items_page?.items
        ?.map(item => `  • ${item.name} (ID: ${item.id})`)
        .join('\n') || '  (no items)'

      return {
        content: [{
          type: 'text',
          text: `✓ Retrieved board: ${board.name}\nBoard ID: ${board.id}\nFiltered Items (${itemCount}):\n${itemList}`
        }],
        structuredContent: {
          result: board
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      return {
        content: [{
          type: 'text',
          text: `✗ Failed to retrieve board details: ${errorMessage}`
        }],
        structuredContent: {
          result: {
            error: true,
            type: 'BoardDetailsError',
            message: errorMessage
          }
        }
      }
    }
  }
}
