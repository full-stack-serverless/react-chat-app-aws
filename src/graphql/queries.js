/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listRooms = /* GraphQL */ `
  query ListRooms(
    $limit: Int
  ) {
    listRooms(limit: $limit) {
      items {
        id
        name
        createdAt
        updatedAt
      }
    }
  }
`;

export const listMessagesForRoom = /* GraphQL */ `
  query ListMessagesForRoom(
    $roomId: ID
    $sortDirection: ModelSortDirection
  ) {
    listMessagesForRoom(
      roomId: $roomId
      sortDirection: $sortDirection
    ) {
      items {
        id
        content
        owner
        createdAt
        roomId
      }
    }
  }
`;
