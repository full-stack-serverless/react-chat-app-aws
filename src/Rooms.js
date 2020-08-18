import React, { useState, useEffect, useReducer } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { API } from 'aws-amplify';

import theme from './theme'
import { listRooms } from './graphql/queries';
import { createRoom as CreateRoom } from './graphql/mutations';
import { onCreateRoom as OnCreateRoom } from './graphql/subscriptions';

const { primaryColor } = theme;

const CREATE_ROOM = "CREATE_ROOM";
const SET_ROOMS = "SET_ROOMS";
const SET_LOADING = "SET_LOADING";

const initialState = {
  loading: false,
  rooms: [],
  loading: true
}

function reducer(state, action) {
  switch (action.type) {
    case CREATE_ROOM:
      return { ...state, rooms: [...state.rooms, action.room] };
    case SET_ROOMS:
      return { ...state, rooms: action.rooms };
    case SET_LOADING:
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

export default function Rooms() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [inputValue, setInputValue] = useState('');
  const history = useHistory();
  let subscription;

  useEffect(() => {
    fetchRooms();
    subscribe();
    return () => subscription.unsubscribe();
  }, []);
  function subscribe() {
    subscription = API.graphql({
      query: OnCreateRoom
    })
    .subscribe({
      next: roomData => {
        console.log({ roomData });
        dispatch({ type: CREATE_ROOM, room: roomData.value.data.onCreateRoom });
      }
    })
  }
  async function fetchRooms() {
    try {
      const roomData = await API.graphql({
        query: listRooms,
        variables: { limit: 1000 }
      });
      dispatch({ type: SET_ROOMS, rooms: roomData.data.listRooms.items });
      console.log('roomData: ', roomData);
    } catch (err) {
      console.log('error: ', err)
    }
  }
  async function createRoom() {
    if (!inputValue) return;
    try {
      const room = await API.graphql({
        query: CreateRoom,
        variables: {
          input: {
            name: inputValue
          }
        }
      })
      history.push(`/chat/${room.data.createRoom.name}/${room.data.createRoom.id}`)
    } catch (err) {
      console.log('error creating room: ', err);
    }
  }
  async function onChange(e) {
    e.persist();
    setInputValue(e.target.value);
  }
  return (
    <div>
      <div>
        <h2 style={titleStyle}>Available chat rooms</h2>
        {
          state.rooms.map((room) => (
            <Link to={`/chat/${room.name}/${room.id}`} key={room.id} style={roomLinkStyle}>
              <p style={roomNameStyle}>{room.name}</p>
            </Link>
          ))
        }
      </div>
      <div style={inputContainerStyle}>
        <div style={inputWrapperStyle}>
          <input
            style={inputStyle}
            placeholder="Room name"
            onChange={onChange}
          />
        </div>
        <div style={buttonWrapperStyle}>
          <button onClick={createRoom} style={buttonStyle}>Create Room</button>
        </div>
      </div>
    </div>
  )
}

const inputWrapperStyle = {
  display: 'flex'
}

const buttonWrapperStyle = {
  display: 'flex',
  alignItems: 'center'
}

const buttonStyle = {
  height: 40,
  outline: 'none',
  border: 'none',
  padding: '0px 20px',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: '1px solid',
  fontSize: 18
}

const inputContainerStyle = {
  display: 'flex',
  position: 'fixed',
  bottom: 0,
  height: 80,
  backgroundColor: '#ddd',
  width: '100%',
  left: 0
}

const inputStyle = {
  border: 'none',
  outline: 'none',
  width: 300,
  padding: 9,
  backgroundColor: 'transparent',
  fontSize: 20,
  marginLeft: 30
}

const roomLinkStyle = {
  textDecoration: 'none'
}

const roomNameStyle = {
  padding: '20px 0px',
  margin: 0,
  borderBottom: '1px solid #ddd',
  fontSize: 18,
  color: 'black',
  fontWeight: 300
}

const titleStyle = {
  color: primaryColor
}