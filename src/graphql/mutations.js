export const createRoom = `
  mutation createRoom($input: RoomInput) {
    createRoom(input: $input) {
      id
      name
    }
  }
`

export const createMessage = `
  mutation createMessage($input: MessageInput) {
    createMessage(input: $input) {
      id
      content
      owner
      createdAt
      roomId
    }
  }
`

