import { getBoardItemContent } from "./items"

// const BOARD_ID = '5842126081'

// const boardDetails = await getBoardDetailsPaginated(BOARD_ID)

// console.log(JSON.stringify(boardDetails, null, 2))

const boardContent = await getBoardItemContent('10647741201')
console.log('boardContent', boardContent)
