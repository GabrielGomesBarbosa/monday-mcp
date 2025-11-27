/**
 * Monday.com Items Service
 * 
 * Operations related to Monday.com items (tasks, work items) including
 * fetching item details and parsing description content.
 */

import { mondayClient } from "../config/client"
import { DocumentBlock } from "../types"
import { extractBlockContents } from "../utils/content-parser"

/**
 * Get item content with parsed description text
 * 
 * Retrieves an item by ID and extracts clean text from its description blocks,
 * filtering out images and formatting the content for readability.
 * 
 * @param itemId - The ID of the item to retrieve
 * @returns Object with item id, name, and parsed description
 */
export async function getBoardItemContent(itemId: string) {
  const query = `query {
    items(ids: [${itemId}]) {
      id
      name
      description {
        id
        blocks {
          id
          doc_id
          content
        }
      }
    }
  }`

  const response = await mondayClient.request<{ items: any[] }>(query)

  let description = ''

  if (response.items[0]?.description?.blocks) {
    description = extractBlockContents(response.items[0]?.description?.blocks as DocumentBlock[])
  }

  return {
    id: response.items[0].id,
    name: response.items[0].name,
    description
  }
}
