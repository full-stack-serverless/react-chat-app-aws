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