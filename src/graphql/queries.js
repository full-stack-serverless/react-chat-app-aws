export const listRooms = `
  query listRooms($limit: Int) {
    listRooms(limit: $limit) {
      items {
        id
        name
      }
    }
  }
`

export const listMessages = `
  query listMessagesForRoom($roomId: ID) {
    listMessagesForRoom(roomId: $roomId) {
      items {
        id
        content
        owner
        createdAt
      }
    }
  }
`
