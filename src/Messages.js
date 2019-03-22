import React, { useState, useEffect } from 'react'
import useCollection from './useCollection'
import { db } from './firebase'

function Messages () {
  const messages = useCollection('channels/random/messages', 'createAt')

  return (
    <div className='Messages'>

      <div className='EndOfMessages'>That's every message!</div>

      {messages.map((message, index) => {
        const previous = messages[index - 1]
        const showAvatar = !previous || message.user.id !== previous.user.id
        const showDay = false
        return showAvatar ? (
          <FirstMessageFromUser message={message} showDay={showDay} />
        ) : (
          <div>
            <div className='Message no-avatar'>
              <div className='MessageContent'>{message.text}</div>
            </div>
          </div>
        )
      })}

    </div>

  )
}

function useDoc (path) {
  const [doc, setDoc] = useState(null)
  useEffect(() => {
    db.doc(path).onSnapshot(doc => {
      setDoc({
        ...doc.data(),
        id: doc.id
      })
      console.log(doc.data())
    })
  }, [path])
  return doc
}

function FirstMessageFromUser ({ message, showDay }) {
  const author = useDoc(message.user.path)
  return (
    <div key={message.id}>
      {showDay && (
        <div className='Day'>
          <div className='DayLine' />
          <div className='DayText'>12/6/2018</div>
          <div className='DayLine' />
        </div>
      )}

      <div className='Message with-avatar'>
        <div className='Avatar'
          style={{
            backgroundImage: author
              ? `url('${author.photoURL}')`
              : ''
          }}
        />
        <div className='Author'>
          <div>
            <span className='UserName'>
              {author && author.displayName}
            </span> {' '}
            <span className='TimeStamp'>3:37 PM</span>
          </div>
          <div className='MessageContent'>{message.text}</div>
        </div>
      </div>
    </div>
  )
}

export default Messages
