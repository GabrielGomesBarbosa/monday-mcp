/**
 * Monday.com Get Me Tool
 * 
 * Retrieves information about the currently authenticated user.
 */

import { z } from 'zod'
import type { ToolDefinition } from '../index'
import { getMe } from '../services/users'

export const getMeTool: ToolDefinition = {
  name: 'monday_get_me',
  config: {
    title: 'Get Monday.com Current User',
    description: 'Retrieve information about the currently authenticated Monday.com user including profile details.',
    inputSchema: {},
    outputSchema: {
      result: z.any().describe('Current user object with profile details or error object')
    }
  },
  handler: async (inputs: any) => {
    try {
      const user = await getMe()

      return {
        content: [{
          type: 'text',
          text: `✓ Current user: ${user?.name || 'Unknown'}\nUser ID: ${user?.id || 'N/A'}\nEmail: ${user?.email || 'N/A'}`
        }],
        structuredContent: {
          result: user
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      return {
        content: [{
          type: 'text',
          text: `✗ Failed to retrieve user information: ${errorMessage}`
        }],
        structuredContent: {
          result: {
            error: true,
            type: 'UserInfoError',
            message: errorMessage
          }
        }
      }
    }
  }
}
