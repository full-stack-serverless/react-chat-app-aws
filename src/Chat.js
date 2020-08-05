import React, { useState, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { API } from 'aws-amplify';

import { listMessages as ListMessages } from './graphql/queries';

export default function Chat() {
  const params = useParams();
  const { name, id } = params;
  useEffect(() => {
    listMessages();
  }, []);
  async function listMessages() {
    try {
      const messages = await API.graphql({
        query: ListMessages,
        variables: {
          roomId: id
        }
      })
      console.log('messages :', messages)
    } catch (err) {
      console.log('error fetching messages: ', err)
    }
  }
  async function createMessage() {

  }
  function onChange () {

  }
  return (
    <div>
      <h2>{name}</h2>

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