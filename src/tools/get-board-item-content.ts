/**
 * Monday.com Get Board Item Content Tool
 * 
 * Retrieves detailed content for a specific board item.
 */

import { z } from 'zod'
import type { ToolDefinition } from '../index'
import { getBoardItemContent } from '../services/items'

export const boardItemContentTool: ToolDefinition = {
  name: 'monday_get_board_item_list',
  config: {
    title: 'Get Monday.com Board Item Content',
    description: 'Retrieve detailed content for a specific board item including its ID, name, and parsed description text.',
    inputSchema: {
      itemId: z.string().describe('The ID of the item to retrieve content for (required)')
    },
    outputSchema: {
      result: z.any().describe('Item content object with id, name, and description or error object')
    }
  },
  handler: async (inputs: any) => {
    try {
      const { itemId } = inputs
      const item = await getBoardItemContent(itemId)

      const descriptionPreview = item.description.length > 100 
        ? `${item.description.substring(0, 100)}...` 
        : item.description

      return {
        content: [{
          type: 'text',
          text: `✓ Retrieved item: ${item.name}\nItem ID: ${item.id}\nDescription: ${descriptionPreview || '(no description)'}`
        }],
        structuredContent: {
          result: item
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      return {
        content: [{
          type: 'text',
          text: `✗ Failed to retrieve item content: ${errorMessage}`
        }],
        structuredContent: {
          result: {
            error: true,
            type: 'ItemContentError',
            message: errorMessage
          }
        }
      }
    }
  }
}
