/**
 * Monday.com Users Service
 * 
 * Operations related to Monday.com users and authentication.
 */

import { mondayClient } from "../config/client"

/**
 * Get current authenticated user information
 * 
 * @returns Current user object with profile details
 */
export async function getMe() {
  const response = await mondayClient.operations.getMeOp()

  return response.me
}
