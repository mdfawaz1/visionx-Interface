import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import VideoFeed from './VideoFeed';
import api from '../api';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #ffffff;
  }
`;

const Notification = styled.div`
  position: fixed;
  top: 65px;
  right: 20px;
  background: linear-gradient(45deg, #00c6ff, #0072ff);
  color: #ffffff;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 0.9;
  transform: translateY(0);

  &:hover {
    opacity: 1;
    transform: translateY(-5px);
  }
`;

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 255, 0);
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
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
`;

const CatalogContainer = styled(motion.div)`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1200px;
`;

const ServerBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 250px;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
  }
`;

const ServerTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  color: #00ffff;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
`;

const StreamCount = styled.p`
  font-size: 1.2rem;
  color: #ff00ff;
  margin-top: 1rem;
`;

const StreamList = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  width: 100%;
  max-width: 600px;
  margin-top: 2rem;
`;

const StreamItem = styled.div`
  margin-bottom: 1rem;
`;

const Button = styled(motion.button)`
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;

  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin-top: 3rem;
`;

const VideoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  aspect-ratio: 16/9;

  &:hover {
    transform: scale(1.02);
  }
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 60px);
  margin-bottom: 1rem;
`;

const LiveIndicator = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 10px;
  height: 10px;
  background-color: #ff0000;
  border-radius: 50%;
  animation: ${pulseAnimation} 1.5s infinite;
`;

const serverUrls = [
<<<<<<< Updated upstream
  { url: 'http://localhost:5008', name: 'Server 1' },{ url: 'http://localhost:5009', name: 'Server 1' }
=======
  { url: 'http://localhost:5008', name: 'Server 1' },
  { url: 'http://localhost:5009', name: 'Server 2' },  { url: 'http://localhost:5010', name: 'Server 3' }, 
>>>>>>> Stashed changes
];

export default function LiveMonitor() {
  const [streams, setStreams] = useState({});
  const [selectedStreams, setSelectedStreams] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
<<<<<<< Updated upstream
  const [error, setError] = useState(null);

  const fetchStreams = async () => {
    try {
      const requests = serverUrls.map(async server => {
        try {
          console.log(`Fetching streams from ${server.url}/api/streams`);
          const response = await fetch(`${server.url}/api/streams`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            mode: 'cors',
            signal: AbortSignal.timeout(5000)
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log(`Received streams from ${server.url}:`, data);
          return { serverUrl: server.url, serverName: server.name, streams: data };
        } catch (error) {
          console.error(`Error fetching stream IDs from ${server.url}:`, error);
          return { serverUrl: server.url, serverName: server.name, streams: [] };
        }
      });

      const results = await Promise.all(requests);
      const streamsByServer = {};
      results.forEach(({ serverUrl, serverName, streams }) => {
        if (streams && streams.length > 0) {
          streamsByServer[serverUrl] = { name: serverName, streams };
        }
      });
      console.log('Updated streams by server:', streamsByServer);
      setStreams(streamsByServer);
      setError(null);
    } catch (err) {
      console.error('Error fetching streams:', err);
      setError('Failed to fetch streams');
    }
  };
=======
  const [notification, setNotification] = useState(null);
>>>>>>> Stashed changes

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      fetchStreams();
    }, 5000);

    const interval = setInterval(fetchStreams, 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const handleStreamToggle = (serverUrl, streamId) => {
    setSelectedStreams(prevSelected => {
      const existingIndex = prevSelected.findIndex(
        s => s.serverUrl === serverUrl && s.streamId === streamId
      );
      if (existingIndex >= 0) {
        return prevSelected.filter((_, index) => index !== existingIndex);
      } else {
        return [...prevSelected, { serverUrl, streamId }];
      }
    });
  };

  const handleServerClick = (serverUrl) => {
    setSelectedServer(serverUrl === selectedServer ? null : serverUrl);
  };

  const stopServer = (port) => {
    api.post('/python-server/stop', { port })
      .then(response => {
        console.log(`Server on port ${port} stopped successfully:`, response.data);
        setStreams(prevStreams => {
          const updatedStreams = { ...prevStreams };
          const serverUrl = Object.keys(updatedStreams).find(url => new URL(url).port === port);
          if (serverUrl) {
            delete updatedStreams[serverUrl];
          }
          return updatedStreams;
        });
        setSelectedServer(null); // Deselect the server if it was selected
        setNotification(`Server on port ${port} stopped successfully.`);
        setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
      })
      .catch(error => {
        console.error(`Error stopping server on port ${port}:`, error);
        setNotification(`Failed to stop server on port ${port}.`);
        setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
      });
  };

  return (
    <>
      <GlobalStyle />
      {notification && <Notification>{notification}</Notification>}
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
        <CatalogContainer>
          {Object.entries(streams).map(([serverUrl, { name, streams: streamIds }]) => {
            const port = new URL(serverUrl).port;
            return (
              <ServerBox
                key={serverUrl}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
                onClick={() => handleServerClick(serverUrl)}
              >
                <ServerTitle>{name}</ServerTitle>
                <StreamCount>{streamIds.length} Streams</StreamCount>
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering server selection
                    stopServer(port);
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  Stop Server
                </Button>
              </ServerBox>
            );
          })}
        </CatalogContainer>
        <AnimatePresence>
          {selectedServer && streams[selectedServer] && (
            <StreamList
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3>{streams[selectedServer].name} Streams</h3>
              {streams[selectedServer].streams.map(streamId => (
                <StreamItem key={streamId}>
                  <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStreamToggle(selectedServer, streamId)}
                  >
                    {selectedStreams.some(s => s.serverUrl === selectedServer && s.streamId === streamId)
                      ? `Remove Stream ${streamId}`
                      : `Add Stream ${streamId}`}
                  </Button>
                </StreamItem>
              ))}
            </StreamList>
          )}
        </AnimatePresence>
        <VideoGrid>
          <AnimatePresence>
            {selectedStreams.map(({ serverUrl, streamId }) => (
              <VideoCard
                key={`${serverUrl}-${streamId}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <VideoContainer>
                  <LiveIndicator />
                  <VideoFeed serverUrl={serverUrl} streamId={streamId} />
                </VideoContainer>
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStreamToggle(serverUrl, streamId)}
                >
                  Remove Stream
                </Button>
              </VideoCard>
            ))}
          </AnimatePresence>
        </VideoGrid>
      </Container>
    </>
  );
}