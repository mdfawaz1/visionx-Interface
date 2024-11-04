import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import VideoFeed from './VideoFeed';  // Import the VideoFeed component

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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const VideoCardContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
`;

const VideoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 400px; /* Set desired width */
  height: 350px; /* Set desired height */
  overflow: hidden;
`;

const StatusIndicator = styled(motion.div)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#00ff00' : '#ff0000'};
  margin-right: 0.5rem;
`;

const StatusBar = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Button = styled(motion.button)`
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    opacity: 0.8;
  }
`;

const serverUrl = 'http://localhost:5007'; // Replace with your actual server URL

const LiveMonitor = () => {
  const [isActive, setIsActive] = useState(true);
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const fetchStreams = () => {
      fetch(`${serverUrl}/api/streams`)
        .then(response => response.json())
        .then(data => {
          setStreams(data);
        })
        .catch(error => console.error("Error fetching stream IDs:", error));
    };

    fetchStreams();
    const interval = setInterval(fetchStreams, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [serverUrl]);

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
          Live Monitor
        </Title>
        <VideoCardContainer>
          {streams.length > 0 ? (
            streams.map(streamId => (
              <VideoCard
                key={streamId}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <StatusBar>
                  <StatusIndicator
                    active={isActive}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  />
                  <span>{isActive ? 'Active' : 'Inactive'}</span>
                </StatusBar>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <VideoFeed serverUrl={serverUrl} streamId={streamId} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsActive(!isActive)}
                >
                  {isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </VideoCard>
            ))
          ) : (
            <p>No streams available.</p>
          )}
        </VideoCardContainer>
      </Container>
    </>
  );
};

export default LiveMonitor;