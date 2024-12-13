import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import VideoFeed from './VideoFeed';
import api from '../api';
import { Box, Typography } from '@mui/material';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Add from '@mui/icons-material/Add';
import VideoIcon from '@mui/icons-material/Videocam';

const primaryColor = '#0066FF';
const secondaryColor = '#FF2E93';
const gradientBg = 'linear-gradient(135deg, #0066FF, #6B37FF, #FF2E93)';
const softGradientBg = 'linear-gradient(135deg, rgba(0, 102, 255, 0.1), rgba(107, 55, 255, 0.1), rgba(255, 46, 147, 0.1))';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    background: #f8fafc;
    color: #0F172A;
  }
`;

const GridBackground = styled.div`
  position: fixed;
  top: -10;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: center center;
  z-index: 0;
  opacity: 0.5;
`;

const Notification = styled.div`
  position: fixed;
  top: 65px;
  right: 20px;
  background: #ffffff;
  color: #1a1a1a;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #2563eb;
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
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
  background: #ffffff;
  margin-top: -100px;
  position: relative;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  margin: 1rem 0 3rem;
  text-align: center;
  background: ${gradientBg};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const ServerGrid = styled(motion.div)`
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${primaryColor}33;
    border-radius: 3px;
  }
`;

const ServerBox = styled(motion.div)`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.isSelected ? primaryColor : 'transparent'};
  min-width: 280px;
  position: relative;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: ${primaryColor};
  }
`;

const ServerTitle = styled.h2`
  font-size: 1.8rem;
  text-align: center;
  color: #1a1a1a;
  font-weight: 600;
  margin: 0;
`;

const StreamCount = styled.p`
  font-size: 1.1rem;
  color: #2563eb;
  margin: 0;
  font-weight: 500;
`;

const StreamsPanelHeader = styled.div`
  position: sticky;
  top: 0;
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  z-index: 2;
  backdrop-filter: blur(10px);
`;

const StreamsPanelContent = styled.div`
  padding: 1.5rem 2rem;
  height: calc(100vh - 140px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${primaryColor}33;
    border-radius: 3px;
  }
`;

const StreamCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  border: 2px solid ${props => props.isSelected ? primaryColor : '#f0f0f0'};
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.isSelected ? primaryColor : primaryColor + '80'};
  }

  ${props => props.isSelected && `
    background: ${softGradientBg};
  `}
`;

const StreamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StreamPreview = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: ${softGradientBg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StreamDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StreamStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.isActive ? '#10B981' : '#6B7280'};

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.isActive ? '#10B981' : '#6B7280'};
  }
`;

const StreamsPanel = styled(motion.div)`
  position: fixed;
  right: ${props => props.isOpen ? '0' : '-400px'};
  top: 0;
  width: 400px;
  height: 100vh;
  background: #ffffff;
  box-shadow: -2px 0 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
  padding: 0.5rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  & > *:first-child:nth-last-child(1) {
    grid-column: 1 / 2;
  }
`;

const VideoCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2563eb;
    transform: scale(1.02);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 5.25%;
  margin-bottom: 1rem;

  img, video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
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

const StatusIndicator = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.active ? '#f0f9ff' : '#fff1f2'};
  border: 2px solid ${props => props.active ? '#2563eb' : '#ef4444'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 10px ${props => props.active ? 'rgba(37, 99, 235, 0.2)' : 'rgba(239, 68, 68, 0.2)'};

  &::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.active ? '#2563eb' : '#ef4444'};
    animation: ${pulseAnimation} 2s infinite;
  }
`;

const Button = styled(motion.button)`
  background: ${gradientBg};
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: ${primaryColor};
  border: none;
  cursor: pointer;
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 101;
  
  &:hover {
    background: ${secondaryColor};
    transform: scale(1.1);
  }

  svg {
    font-size: 20px;
  }
`;

const MinimizeButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  left: -36px;
  transform: translateY(-50%);
  width: 36px;
  height: 72px;
  background: ${primaryColor};
  border: none;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 101;
  
  &:hover {
    background: ${secondaryColor};
    width: 40px;
    left: -40px;
  }

  svg {
    font-size: 24px;
  }
`;

const ClearButton = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  background: #fff;
  border: 1px solid ${primaryColor};
  color: ${primaryColor};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${primaryColor}11;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const HeaderCloseButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  color: ${primaryColor};
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: ${primaryColor}11;
    transform: scale(1.1);
  }

  svg {
    font-size: 20px;
  }
`;

const serverUrls = [
  { url: 'http://localhost:5008', name: 'Server 1' },
  { url: 'http://localhost:5009', name: 'Server 2' },
  { url: 'http://localhost:5010', name: 'Server 3' },
  { url: 'http://localhost:5011', name: 'Server 4' },
  { url: 'http://localhost:5012', name: 'Server 5' },
  { url: 'http://localhost:5013', name: 'Server 6' },
  { url: 'http://localhost:5014', name: 'Server 7' },
  { url: 'http://localhost:5015', name: 'Server 8' },
  { url: 'http://localhost:5016', name: 'Server 9' },
  { url: 'http://localhost:5017', name: 'Server 10' },
  { url: 'http://localhost:5018', name: 'Server 11' },
  { url: 'http://localhost:5019', name: 'Server 12' },
  { url: 'http://localhost:5020', name: 'Server 13' },
  { url: 'http://localhost:5021', name: 'Server 14' },
  { url: 'http://localhost:5022', name: 'Server 15' },
];

export default function LiveMonitor() {
  const [streams, setStreams] = useState({});
  const [selectedStreams, setSelectedStreams] = useState(() => {
    const saved = localStorage.getItem('selectedStreams');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedServer, setSelectedServer] = useState(() => {
    const saved = localStorage.getItem('selectedServer');
    return saved || null;
  });
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

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
            signal: AbortSignal.timeout(2000)
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

  useEffect(() => {
    fetchStreams();

    const interval = setInterval(fetchStreams, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedStreams', JSON.stringify(selectedStreams));
  }, [selectedStreams]);

  useEffect(() => {
    localStorage.setItem('selectedServer', selectedServer || '');
  }, [selectedServer]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setSelectedServer(null);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleStreamToggle = (serverUrl, streamId) => {
    setSelectedStreams(prevSelected => {
      const existingIndex = prevSelected.findIndex(
        s => s.serverUrl === serverUrl && s.streamId === streamId
      );
      const newSelected = existingIndex >= 0
        ? prevSelected.filter((_, index) => index !== existingIndex)
        : [...prevSelected, { serverUrl, streamId }];
      
      return newSelected;
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
            setSelectedStreams(prev => prev.filter(s => s.serverUrl !== serverUrl));
            if (selectedServer === serverUrl) {
              setSelectedServer(null);
            }
            delete updatedStreams[serverUrl];
          }
          return updatedStreams;
        });
        setNotification(`Server on port ${port} stopped successfully.`);
        setTimeout(() => setNotification(null), 3000);
      })
      .catch(error => {
        console.error(`Error stopping server on port ${port}:`, error);
        setNotification(`Failed to stop server on port ${port}.`);
        setTimeout(() => setNotification(null), 3000);
      });
  };

  const clearSelectedStreams = (serverUrl) => {
    setSelectedStreams(prev => prev.filter(s => s.serverUrl !== serverUrl));
  };

  return (
    <>
      <GlobalStyle />
      <GridBackground />
      {notification && <Notification>{notification}</Notification>}
      <Container>
        <Title
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          Live Monitor
        </Title>

        <ServerGrid>
          {Object.entries(streams).map(([serverUrl, { name, streams: streamIds }]) => {
            const port = new URL(serverUrl).port;
            const isSelected = serverUrl === selectedServer;
            
            return (
              <ServerBox
                key={serverUrl}
                isSelected={isSelected}
                onClick={() => handleServerClick(serverUrl)}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <StatusIndicator active={streamIds.length > 0} />
                <div>
                  <ServerTitle>{name}</ServerTitle>
                  <StreamCount>
                    {streamIds.length} {streamIds.length === 1 ? 'Stream' : 'Streams'}
                  </StreamCount>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    stopServer(port);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ marginLeft: 'auto' }}
                >
                  Stop
                </Button>
              </ServerBox>
            );
          })}
        </ServerGrid>

        <AnimatePresence>
          {selectedServer && streams[selectedServer] && (
            <StreamsPanel
              isOpen={!!selectedServer}
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <StreamsPanelHeader>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {streams[selectedServer].name}
                  </Typography>
                  <CloseButton onClick={() => setSelectedServer(null)}>
                    <Close />
                  </CloseButton>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {streams[selectedServer].streams.length} Available
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {selectedStreams.filter(s => s.serverUrl === selectedServer).length} Selected
                    <Check sx={{ fontSize: 16 }} />
                  </Typography>
                </Box>
              </StreamsPanelHeader>

              <StreamsPanelContent>
                {streams[selectedServer].streams.map(streamId => {
                  const isSelected = selectedStreams.some(
                    s => s.serverUrl === selectedServer && s.streamId === streamId
                  );
                  
                  return (
                    <StreamCard
                      key={streamId}
                      isSelected={isSelected}
                      onClick={() => handleStreamToggle(selectedServer, streamId)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <StreamInfo>
                        <StreamPreview>
                          <VideoIcon sx={{ fontSize: 24, color: primaryColor }} />
                        </StreamPreview>
                        <StreamDetails>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            Stream {streamId}
                          </Typography>
                          <StreamStatus isActive={true}>
                            Live
                          </StreamStatus>
                        </StreamDetails>
                      </StreamInfo>
                      <motion.div
                        initial={false}
                        animate={{ scale: isSelected ? 1 : 0.8, opacity: isSelected ? 1 : 0.6 }}
                      >
                        {isSelected ? (
                          <Check sx={{ color: primaryColor, fontSize: 24 }} />
                        ) : (
                          <Add sx={{ color: '#6B7280', fontSize: 24 }} />
                        )}
                      </motion.div>
                    </StreamCard>
                  );
                })}

                {selectedStreams.some(s => s.serverUrl === selectedServer) && (
                  <ClearButton
                    onClick={() => clearSelectedStreams(selectedServer)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Close sx={{ fontSize: 18 }} />
                    Close All Streams
                  </ClearButton>
                )}
              </StreamsPanelContent>
            </StreamsPanel>
          )}
        </AnimatePresence>

        <VideoGrid>
          {selectedStreams.map(({ serverUrl, streamId }) => (
            <VideoCard
              key={`${serverUrl}-${streamId}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <VideoContainer>
                <LiveIndicator />
                <VideoFeed serverUrl={serverUrl} streamId={streamId} />
              </VideoContainer>
              <Button
                onClick={() => handleStreamToggle(serverUrl, streamId)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Remove Stream
              </Button>
            </VideoCard>
          ))}
        </VideoGrid>
      </Container>
    </>
  );
}
