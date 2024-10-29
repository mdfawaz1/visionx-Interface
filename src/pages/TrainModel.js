import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
// import axios from 'axios';
import api from '../api'
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: #0f0f1f;
    color: #ffffff;
  }
`;

const Container = styled(motion.div)`
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -8rem; /* Reduced from -5rem */
  padding: 2rem;
`;


const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const Form = styled(motion.form)`
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #00000;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid pink;
  border-radius: 5px;
  color:blue;
  font-size: 1rem;

  &::placeholder {
    color:black;
  }

  &:focus {
    outline: none;
    border-color: #00ffff;
    background: cream;
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Message = styled(motion.div)`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 5px;
  background: ${({ type }) => (type === 'success' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)')};
  color: white;
  font-size: 1rem;
  text-align: center;
`;

// const api = axios.create({
//   baseURL: 'http://localhost:26000/api/v1',
// });

function TrainModel() {
  const [formValues, setFormValues] = useState({
    modelType: '',
    dataPath: '',
    epochs: 50,
    batchSize: 16,
    learningRate: 0.001,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: name === 'epochs' || name === 'batchSize' ? parseInt(value) : name === 'learningRate' ? parseFloat(value) : value,
    }));
  };

  const handleStartTraining = (e) => {
    e.preventDefault();
    setLoading(true);
    api.post('/model/train', formValues)
      .then(response => {
        setMessage({ type: 'success', text: response.data.message });
        setLoading(false);
      })
      .catch(error => {
        setMessage({ type: 'error', text: 'Error starting training' });
        setLoading(false);
      });
  };

  return (
    <>
      <GlobalStyle />
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
          Train Model
        </Title>
        <Form
          onSubmit={handleStartTraining}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <InputGroup>
            <Label htmlFor="modelType">Model Type</Label>
            <Input
              id="modelType"
              placeholder="Enter model type"
              name="modelType"
              value={formValues.modelType}
              onChange={handleChange}
              required
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="dataPath">Data Path</Label>
            <Input
              id="dataPath"
              placeholder="Enter data path"
              name="dataPath"
              value={formValues.dataPath}
              onChange={handleChange}
              required
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="epochs">Epochs</Label>
            <Input
              id="epochs"
              placeholder="Enter number of epochs"
              name="epochs"
              type="number"
              value={formValues.epochs}
              onChange={handleChange}
              required
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="batchSize">Batch Size</Label>
            <Input
              id="batchSize"
              placeholder="Enter batch size"
              name="batchSize"
              type="number"
              value={formValues.batchSize}
              onChange={handleChange}
              required
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="learningRate">Learning Rate</Label>
            <Input
              id="learningRate"
              placeholder="Enter learning rate"
              name="learningRate"
              type="number"
              step="0.001"
              value={formValues.learningRate}
              onChange={handleChange}
              required
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            />
          </InputGroup>
          <Button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Training...' : 'Start Training'}
          </Button>
        </Form>
        <AnimatePresence>
          {message && (
            <Message
              type={message.type}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              {message.text}
            </Message>
          )}
        </AnimatePresence>
      </Container>
    </>
  );
}

export default TrainModel;