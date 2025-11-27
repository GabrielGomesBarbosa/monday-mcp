/**
 * Monday.com Boards Service
 * 
 * Operations related to Monday.com boards (listing, filtering, querying board data).
 */

import { Board } from "@mondaydotcomorg/api"
import { mondayClient } from "../config/client"

/**
 * Get a paginated list of boards
 * 
 * @param limit - Maximum number of boards to return (default: 10)
 * @param page - Page number for pagination (default: 1)
 * @returns Array of board objects
 */
export async function getBoardListPaginated(limit: number = 10, page: number = 1) {
  const queryListBoard = `query {
    boards(limit: ${limit}, page: ${page}) {
      id
      name
      description
      item_terminology
      url
      views { 
        type
        id
        name
      }
    }
  }`

  const response = await mondayClient.request<{ boards: Board[] }>(queryListBoard)

  return response.boards
}

/**
 * Get detailed information about a specific board with filtered items
 * 
 * @param boardId - The ID of the board to query
 * @returns Array of boards with filtered items
 */
export async function getBoardDetailsPaginated(boardId: string) {
  const boardDetailsQuery = `query {
    boards(ids: [${boardId}]) {
      id
      name
      items_page(
        query_params: {
          rules: [
            {
              column_id: "task_owner", 
              compare_value: "assigned_to_me"
            }, 
            {
              column_id: "task_status", 
              compare_value: "Ready to start", 
              operator: contains_terms
            }
          ]
        }
      ) {
        items {
          id
          name
        }
      }
    }
  }`

  const response = await mondayClient.request<{ boards: Board[] }>(boardDetailsQuery)

  return response.boards
}
