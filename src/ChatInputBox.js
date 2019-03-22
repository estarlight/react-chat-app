import React from 'react'
import { db } from './firebase'

function ChatInputBox ({ user }) {
  return (
    <form onSubmit={event => {
      event.preventDefault()
      const value = event.target.elements[0].value
      db
        .collection('channels')
        .doc('random')
        .collection('messages')
        .add({
          user: db.collection('users').doc(user.uid),
          text: value,
          createAt: new Date()
        })
      event.target.reset()
    }} className='ChatInputBox'>
      <input className='ChatInput' placeholder='Message #general' />
    </form>
  )
}

export default ChatInputBox
