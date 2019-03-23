import React, { useEffect, useRef } from 'react'
import useCollection from './useCollection'
import useDocWithCache from './useDocWithCache'
import formatDate from 'date-fns/format'
import { isSameDay } from 'date-fns'

function ChatScroller (props) {
  const ref = useRef()
  const shouldScrollRef = useRef(true)

  useEffect(() => {
    if (shouldScrollRef.current) {
      const node = ref.current
      node.scrollTop = node.scrollHeight
    }
  })

  const handleScroll = () => {
    const node = ref.current
    const { scrollTop, clientHeight, scrollHeight } = node
    const atBottom = scrollHeight === clientHeight + scrollTop
    shouldScrollRef.current = atBottom
  }

  return <div {...props} ref={ref} onScroll={handleScroll} />
}

function Messages ({ channelId }) {
  const messages = useCollection(`channels/${channelId}/messages`, 'createAt')

  return (
    <ChatScroller className='Messages'>

      <div className='EndOfMessages'>That's every message!</div>

      {messages.map((message, index) => {
        const previous = messages[index - 1]
        const showAvatar = shouldShowAvatar(previous, message)
        const showDay = shouldShowDay(previous, message)
        return showAvatar ? (
          <FirstMessageFromUser key={message.id} message={message} showDay={showDay} />
        ) : (
          <div key={message.id}>
            <div className='Message no-avatar'>
              <div className='MessageContent'>{message.text}</div>
            </div>
          </div>
        )
      })}

    </ChatScroller>

  )
}

function FirstMessageFromUser ({ message, showDay }) {
  const author = useDocWithCache(message.user.path)
  return (
    <div key={message.id}>
      {showDay && (
        <div className='Day'>
          <div className='DayLine' />
          <div className='DayText'>{new Date(message.createAt.seconds * 1000).toLocaleDateString()}</div>
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
            <span className='TimeStamp'>{formatDate(
              message.createAt.seconds * 1000,
              'h:mm A')}</span>
          </div>
          <div className='MessageContent'>{message.text}</div>
        </div>
      </div>
    </div>
  )
}

function shouldShowAvatar (previous, message) {
  const isFirst = !previous
  if (isFirst) {
    return true
  }

  const differentUser = message.user.id !== previous.user.id
  if (differentUser) {
    return true
  }
  const hasBeenAwhile = message.createAt.seconds - previous.createAt.seconds > 180
  return hasBeenAwhile
}

function shouldShowDay (previous, message) {
  const isFirst = !previous
  if (isFirst) {
    return true
  }

  const isNewDay = !isSameDay(
    previous.createAt.seconds * 1000,
    message.createAt.seconds * 1000
  )
  return isNewDay
}

export default Messages
