import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress, Box } from '@mui/material';

const VideoFeed = ({ serverUrl, streamId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!streamId) {
      setError('No streamId provided');
      return;
    }

    // Construct the video feed URL
    const url = `${serverUrl}/video_feed/${streamId}`;
    console.log("Connecting to video feed:", url);

    // Create a new image element
    if (imgRef.current) {
      // Set up the image source with a timestamp to prevent caching
      imgRef.current.src = `${url}?t=${new Date().getTime()}`;
      
      // Set up error handling for the stream
      imgRef.current.onerror = () => {
        console.error('Error loading video feed');
        setError('Failed to load video feed');
        setIsLoading(false);
      };
    }

    return () => {
      // Cleanup: remove the image source when component unmounts
      if (imgRef.current) {
        imgRef.current.src = '';
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