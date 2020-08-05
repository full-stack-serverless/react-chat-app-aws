export const createRoom = `
  mutation createRoom($input: RoomInput) {
    createRoom(input: $input) {
      id
      name
    }
  }
`