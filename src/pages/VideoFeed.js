import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress, Box } from '@mui/material';

const VideoFeed = ({ serverUrl, streamId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const imgRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!streamId) {
      setError('No streamId provided');
      return;
    }

    // Convert HTTP/HTTPS URL to WebSocket URL
    const wsUrl = serverUrl.replace(/^http/, 'ws');
    const socketUrl = `${wsUrl}/ws/video_feed/${streamId}`;
    
    console.log("Connecting to WebSocket:", socketUrl);

    // Create WebSocket connection
    wsRef.current = new WebSocket(socketUrl);

    wsRef.current.onopen = () => {
      console.log('WebSocket connection established');
      setError(null);
    };

    wsRef.current.onmessage = (event) => {
      if (imgRef.current) {
        // Convert blob to base64 and update image
        const reader = new FileReader();
        reader.onload = () => {
          imgRef.current.src = reader.result;
          setIsLoading(false);
        };
        reader.readAsDataURL(event.data);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Failed to connect to video feed');
      setIsLoading(false);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed');
      setError('Video feed connection closed');
      setIsLoading(false);
    };

    return () => {
      // Cleanup: close WebSocket connection when component unmounts
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [serverUrl, streamId]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  return (
    <div style={{ position: 'relative', minHeight: '300px' }}>
      {isLoading && (
        <Box 
          sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Box 
          sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'red'
          }}
        >
          {error}
        </Box>
      )}
      <img
        ref={imgRef}
        alt="Live Inference"
        onLoad={handleImageLoad}
        style={{
          width: '100%',
          height: '300px',
          objectFit: 'cover',
          borderRadius: '8px',
          display: isLoading || error ? 'none' : 'block',
        }}
      />
    </div>
  );
};

export default VideoFeed;