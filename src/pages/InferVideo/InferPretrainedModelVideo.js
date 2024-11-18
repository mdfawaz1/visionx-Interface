"use client"

import React, { useState, useEffect } from 'react'
// import axios from 'axios'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import api from '../../api'
// const api = axios.create({
//   baseURL: 'http://localhost:26000/api/v1',
// })

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }
`

const theme = {
  colors: {
    primary: '#0072ff',
    secondary: '#ff0080',
    background: 'linear-gradient(135deg, #00c6ff, #0072ff, #ff0080)',
  },
}

const Container = styled(motion.div)`
height: 93vh;
  width: 84vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  padding: 0rem;
  color: white;
  margin-top: -5rem; 
`

const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`

const Form = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`

const Input = styled(motion.input)`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`

const Select = styled(motion.select)`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;

  option {
    background: ${props => props.theme.colors.primary};
  }
`

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(90deg, ${props => props.theme.colors.secondary}, #ff8c00);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const Message = styled(motion.div)`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background: ${({ type }) => (type === 'success' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)')};
  color: white;
`

function InferPretrainedModelVideo() {
  const [videoFile, setVideoFile] = useState(null)
  const [modelName, setModelName] = useState('')
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    api.get('/models')
      .then(response => setModels(response.data))
      .catch(error => console.error('Error fetching models:', error))
  }, [])

  const handleInfer = () => {
    setLoading(true)
    const formData = new FormData()
    formData.append('videoFile', videoFile)
    formData.append('modelName', modelName)

    api.post('/model/infer', formData)
      .then(response => {
        setMessage({ type: 'success', text: response.data.message })
        setLoading(false)
      })
      .catch(error => {
        setMessage({ type: 'error', text: 'Error processing video' })
        setLoading(false)
      })
  }

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Title
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        Run Pretrained Model on Video
      </Title>
      <Form
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <AnimatePresence>
          {message && (
            <Message
              type={message.type}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {message.text}
            </Message>
          )}
        </AnimatePresence>
        <Input
          type="file"
          accept="video/*"
          onChange={e => setVideoFile(e.target.files[0])}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
        {videoFile && <p>{videoFile.name}</p>}
        <Select
          value={modelName}
          onChange={e => setModelName(e.target.value)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <option value="">Select Model</option>
          {models.map(model => (
            <option key={model._id} value={model.name}>
              {model.name}
            </option>
          ))}
        </Select>
        <Button
          onClick={handleInfer}
          disabled={loading || !videoFile || !modelName}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Processing...' : 'Run Model'}
        </Button>
      </Form>
    </Container>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <InferPretrainedModelVideo />
    </ThemeProvider>
  )
}