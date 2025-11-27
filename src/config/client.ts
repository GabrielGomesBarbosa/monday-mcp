/**
 * Monday.com API Client Configuration
 * 
 * Singleton instance of the Monday.com API client configured with authentication token.
 */

import { ApiClient } from '@mondaydotcomorg/api'

const MONDAY_API_TOKEN = process.env.MONDAY_API_TOKEN

if (!MONDAY_API_TOKEN) {
  throw new Error('MONDAY_API_TOKEN environment variable is required')
}

export const mondayClient = new ApiClient({ token: MONDAY_API_TOKEN })
