import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function ChatBox({ otherUserId }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    async function load() {
      if (!otherUserId) return
      const res = await api.get(`/chat/thread/${otherUserId}`)
      setMessages(res.data.messages || [])
    }
    load()
  }, [otherUserId])

  const send = async () => {
    if (!text) return
    try {
      const res = await api.post('/chat/send', { receiver_id: otherUserId, content: text })
      setMessages(prev => [...prev, res.data.msg])
      setText('')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-white p-3 rounded shadow">
      <div className="h-48 overflow-y-auto mb-2">
        {messages.map(m => <div key={m.id} className="mb-2"><strong>{m.sender_id}</strong>: {m.content}</div>)}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Type a message"/>
        <button onClick={send} className="px-3 py-2 bg-sky-600 text-white rounded">Send</button>
      </div>
    </div>
  )
}
