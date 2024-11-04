import React, { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';

const VideoFeed = ({ serverUrl, streamId }) => {  // Added streamId as a prop
  const [videoSrc, setVideoSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!streamId) {
      console.error('No streamId provided');
      return;
    }
    console.log("stream_ids-->",streamId);
    // Add a timestamp to prevent caching
    const url = `${serverUrl}/video_feed/${streamId}?${new Date().getTime()}`;
    setVideoSrc(url);
  }, [serverUrl, streamId]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}
      <img
        src={videoSrc}
        alt="Live Inference"
        onLoad={handleImageLoad}
        style={{
          width: '100%',
          maxWidth: '800px',
          border: '2px solid #ccc',
          borderRadius: '8px',
          display: isLoading ? 'none' : 'block',
        }}
      />
    </div>
  );
};

export default VideoFeed;