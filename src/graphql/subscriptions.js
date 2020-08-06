export const onCreateMessage = `
  subscription onCreateMessage($roomId: ID) {
    onCreateMessage(roomId: $roomId) {
      id
      content
      owner
      createdAt
      roomId
    }
  }
`
