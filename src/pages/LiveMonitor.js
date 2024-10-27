// src/pages/LiveMonitor.js
import React from 'react';
import VideoFeed from './VideoFeed';
import './LiveMonitor.css';

const serverUrl = 'http://localhost:5007'; // Replace with your actual server URL

const LiveMonitor = () => {
  return (
    <div className="live-monitor">
      <h1>Live Monitor</h1>
      <div className="video-card-container">
        <div className="video-card">
          <VideoFeed serverUrl={serverUrl} />
        </div>
      </div>
    </div>
  );
};

export default LiveMonitor;
