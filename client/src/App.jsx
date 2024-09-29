import { useEffect, useRef, useState } from 'react'
import { Box, Button, InputBase, Typography } from '@mui/material'
import './index.css'

import { io } from 'socket.io-client'


let socket
function App() {
  const [chatHistory, setChatHistory] = useState([
  ])

  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [name, setName] = useState('')

  function addMessage(name, text, type,id) {
    console.log(name, text, type,id,'xs')

    setChatHistory((prevState) => [
      ...prevState,
      {
        name,
        text,
        type,
        id
      }
    ])
  }

  useEffect(() => {
    // Ensure that socket only connects once
      socket = io('http://localhost:3001'); // Your server address
    // Listen for incoming messages
    socket.on('connect', () => {
      addMessage('',`You connected with id:${socket.id}`, 'enter',socket.id)

    })

    socket.on('receive-message', (message) => {

      addMessage(message.name, message.message, 'message',socket.id)
    })

    socket.on('user-connected', (name,room) => {

      addMessage(name,` joined room ${room}`, 'enter',socket.id)

    })
    // Cleanup function to close the conntion when the component unmounts


    return () => {
      setChatHistory([])
      socket.disconnect();
    }
  }, []);

  

  function handleOnSend(e) {
    e.preventDefault()
    const socketMessage = {
      name,
      message,
      id:socket.id
    }
    console.log('ma',room);

    socket.emit('send-message', socketMessage,room)
    addMessage('You',message,'message',socket.id)

  }
  function handleOnJoin(e) {
    e.preventDefault()
    socket.emit('join-room', room,name)

    setRoom('')
  }



  return (
    <Box display='flex' position='relative' py={1} flexDirection='column' justifyContent='space-between' height='100vh' maxHeight='100vh' alignItems='center'>

      <Box position='absolute'  left={0} top={0}>
        <Typography>Name</Typography>
        <InputBase onChange={(e)=>setName(e.target.value)}/>
      </Box>
      <Box width='80%' height='70%' border='1px solid black'
        display='flex' overflow={'auto'} flexDirection='column' justifyContent=''



      >{chatHistory.map((chat, index) => <Typography bgcolor={`${chat.type === 'enter' ? 'grey' : ''}`} key={index}>{chat.name}{chat.name?':':''} {chat.text}</Typography>)}</Box>
      <Box onSubmit={handleOnSend} width='80%' display='flex' justifyContent={'space-between'} alignItems={'center'} gap={2} component='form'>
        <Typography width='10%' maxWidth='10%'>Message</Typography>
        <InputBase  value={message} onChange={(e) => setMessage(e.target.value)}  sx={{ color: 'white', width: '70%', border: '1px solid black' }} />
        <Button type='submit'>Send</Button>
      </Box>
      <Box onSubmit={handleOnJoin} width='80%' display='flex' justifyContent={'space-between'} alignItems={'center'} gap={2} component='form'>
        <Typography width='10%' maxWidth='10%'>Room</Typography>
        <InputBase value={room} onChange={(e) => setRoom(e.target.value)} sx={{ color: 'white',width: '70%', border: '1px solid black' }} />
        <Button type='submit'>Join</Button>
      </Box>
    </Box>
  )
}

export default App
