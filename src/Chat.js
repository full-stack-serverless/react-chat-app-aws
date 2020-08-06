import React, { useState, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { API, Auth } from 'aws-amplify';
import theme from './theme';

import { listMessagesForRoom as ListMessages } from './graphql/queries';

const { primaryColor } = theme;

const CREATE_MESSAGE = "CREATE_MESSAGE";
const SET_MESSAGES = "SET_MESSAGES";
const SET_LOADING = "SET_LOADING";

const initialState = {
  messages: [],
  loading: false
}

function reducer(state, action) {
  switch(action.type) {
    case CREATE_MESSAGE:
      return {
        ...state, messages: [...state.messages, action.message]
      }
    case SET_MESSAGES:
      return {
        ...state, messages: action.messages
      }
    case SET_LOADING:
      return {
        ...state, loading: action.loading
      }
    default:
      return state;
  }
}

export default function Chat() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, setUser] = useState(null);
  const params = useParams();
  const { name, id } = params;
  useEffect(() => {
    listMessages();
    setUserState();
  }, []);
  async function setUserState() {
    const user = await Auth.currentAuthenticatedUser();
    setUser(user);
  }
  async function listMessages() {
    try {
      const messageData = await API.graphql({
        query: ListMessages,
        variables: {
          roomId: id
        }
      })
      dispatch({ type: SET_MESSAGES, messages: messageData.data.listMessagesForRoom.items });
    } catch (err) {
      console.log('error fetching messages: ', err)
    }
  }
  async function createMessage() {

  }
  function onChange () {

  }
  console.log('state: ', state)
  return (
    <div>
      <h2>Room: {name}</h2>
      <div>
        {
          state.messages.map(message => (
            <div key={message.id} style={messageContainerStyle(user, message)}>
              <p style={messageStyle(user, message)}>{message.content}</p>
              <p style={ownerStyle(user, message)}>{message.owner}</p>
            </div>
          ))
        }
      </div>
      <div style={inputContainerStyle}>
        <div style={inputWrapperStyle}>
          <input
            style={inputStyle}
            placeholder="Message"
            onChange={onChange}
          />
        </div>
        <div style={buttonWrapperStyle}>
          <button onClick={createMessage} style={buttonStyle}>Send message</button>
        </div>
      </div>
    </div>
  )
}

const messageContainerStyle = (user, message) => {
  const isOwner = user && user.username === message.owner;
  return {
    backgroundColor: isOwner ? primaryColor : '#ddd',
    padding: 20,
    borderRadius: 20
  }
}

const messageStyle = (user, message) => {
  const isOwner = user && user.username === message.owner;
  return {
     color: isOwner ? 'white' : 'black',
     fontSize: 22,
     margin: 0
  }
}

const ownerStyle = (user, message) => {
  const isOwner = user && user.username === message.owner;
  return {
     color: isOwner ? '#ddd' : '#666',
     fontWeight: 400,
     fontSize: 18,
     marginTop: 8,
     marginBottom: 0
  }
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