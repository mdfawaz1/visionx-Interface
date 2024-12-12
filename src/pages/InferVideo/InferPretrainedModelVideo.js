"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import api from '../../api'

// Reuse the same AnimatedButton component
function AnimatedButton({ onClick, disabled, style, children }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      style={{
        padding: '1rem',
        border: 'none',
        borderRadius: '10px',
        color: 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        ...style
      }}
    >
      {children}
    </motion.button>
  )
}

// Model Card for pretrained models
function ModelCard({ model, selected, onClick, onNext }) {
  const controls = useAnimation();
  
  const handleHover = async () => {
    await controls.start({
      scale: 1.02,
      transition: { duration: 0.2 }
    });
  };

  const handleHoverEnd = async () => {
    await controls.start({
      scale: 1,
      transition: { duration: 0.2 }
    });
  };

  return (
    <motion.div 
      onClick={onClick}
      animate={controls}
      onHoverStart={handleHover}
      onHoverEnd={handleHoverEnd}
      style={{
        padding: '1.8rem',
        marginBottom: '1.2rem',
        background: `linear-gradient(145deg, 
          ${selected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)'} 0%, 
          ${selected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.02)'} 100%)`,
        borderRadius: '20px',
        cursor: 'pointer',
        width: '100%',
        transition: 'all 0.3s ease',
        border: selected ? '2px solid rgba(255, 255, 255, 0.5)' : '2px solid transparent',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        boxShadow: selected ? '0 8px 32px rgba(31, 38, 135, 0.2)' : 'none'
      }}
    >
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {/* Model Icon/Avatar */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '15px',
          background: 'linear-gradient(45deg, #0072ff, #00c6ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          flexShrink: 0,
          boxShadow: '0 4px 15px rgba(0, 114, 255, 0.3)'
        }}>
          {model.icon || model.name.charAt(0).toUpperCase()}
        </div>

        {/* Model Info */}
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '0.8rem'
          }}>
            <div>
              <h3 style={{ 
                margin: '0', 
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {model.name}
                <span style={{ 
                  fontSize: '0.8rem',
                  background: 'rgba(0, 114, 255, 0.2)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '50px',
                  color: '#0072ff'
                }}>
                  Pretrained
                </span>
              </h3>
              <div style={{ 
                fontSize: '0.9rem', 
                opacity: 0.7,
                marginTop: '0.3rem' 
              }}>
                Use Case: {model.useCase || 'General Object Detection'}
              </div>
            </div>

            {selected && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                style={{
                  background: 'linear-gradient(45deg, #0072ff, #00c6ff)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  boxShadow: '0 2px 10px rgba(0, 114, 255, 0.3)',
                  flexShrink: 0
                }}
              >
                ✓
              </motion.div>
            )}
          </div>

          {/* Model Features */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginTop: '1rem'
          }}>
            {['Fast Inference', 'High Accuracy', 'Real-time Detection'].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '50px',
                  fontSize: '0.8rem',
                  opacity: 0.8
                }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <AnimatedButton
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            style={{
              background: 'linear-gradient(90deg, #0072ff, #00c6ff)',
              padding: '0.8rem 2rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '50px'
            }}
          >
            Next Step →
          </AnimatedButton>
        </motion.div>
      )}
    </motion.div>
  );
}

function VideoPreview({ file, onRemove }) {
  const [preview, setPreview] = useState('');
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [videoInfo, setVideoInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        setVideoInfo({
          duration: Math.round(video.duration),
          width: video.videoWidth,
          height: video.videoHeight
        });
      };

      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        width: '100%',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '15px',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <video
        ref={videoRef}
        src={preview}
        style={{
          width: '100%',
          borderRadius: '15px',
          marginBottom: '-6px',
          background: '#000'
        }}
        controls
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '1rem',
        background: 'linear-gradient(rgba(0,0,0,0.8), transparent)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: isPlaying ? 0 : 1,
        transition: 'opacity 0.3s ease'
      }}>
        <div style={{ fontSize: '0.9rem' }}>
          Preview Mode
        </div>
        {videoInfo && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '0.3rem 0.8rem',
            borderRadius: '50px',
            fontSize: '0.8rem'
          }}>
            {videoInfo.width}x{videoInfo.height}
          </div>
        )}
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1rem',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>{file.name}</h4>
          {videoInfo && (
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              {formatDuration(videoInfo.duration)} • {videoInfo.width}x{videoInfo.height}
            </div>
          )}
        </div>
        <AnimatedButton
          onClick={onRemove}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            padding: '0.5rem 1rem'
          }}
        >
          Change Video
        </AnimatedButton>
      </div>
    </motion.div>
  );
}

function StepIndicator({ currentStep, steps }) {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '1rem', 
      marginBottom: '2rem',
      width: '100%'
    }}>
      {steps.map((step, index) => (
        <div
          key={step}
          style={{
            flex: 1,
            position: 'relative'
          }}
        >
          <motion.div
            initial={false}
            animate={{
              opacity: currentStep === index ? 1 : 0.5,
              y: currentStep === index ? 0 : 5
            }}
            style={{
              textAlign: 'center',
              paddingBottom: '0.5rem'
            }}
          >
            <div style={{ 
              fontSize: '0.9rem', 
              marginBottom: '0.3rem' 
            }}>
              Step {index + 1}
            </div>
            {step}
          </motion.div>
          <motion.div
            initial={false}
            animate={{
              width: currentStep >= index ? '100%' : '0%'
            }}
            style={{
              height: '2px',
              background: 'white',
              position: 'absolute',
              bottom: 0,
              left: 0,
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      ))}
    </div>
  )
}

function InferPretrainedModelVideo() {
  const [videoFile, setVideoFile] = useState(null)
  const [modelName, setModelName] = useState('')
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #00c6ff, #0072ff, #ff0080)',
    padding: '2rem',
    paddingTop: '5rem',
    paddingLeft: '15rem',
    color: 'white',
    overflow: 'hidden',
    zIndex: 1000
  }

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '95%',
    maxWidth: '800px',
    height: '90vh',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '25px',
    padding: '2rem',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    overflow: 'hidden',
    position: 'relative'
  }

  useEffect(() => {
    api.get('/models')
      .then(response => setModels(response.data))
      .catch(error => {
        console.error('Error fetching models:', error);
        setMessage({ type: 'error', text: 'Failed to load models' });
      });
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
      } else {
        setMessage({ type: 'error', text: 'Please upload a video file' });
      }
    }
  };

  const handleInfer = async () => {
    if (!videoFile || !modelName) {
      setMessage({ type: 'error', text: 'Please select a video file and model.' });
      return;
    }

    setLoading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('videoFile', videoFile);
    formData.append('modelName', modelName);

    try {
      const response = await api.post('/model/infer', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      
      setMessage({ type: 'success', text: response.data.message });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error processing video' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ 
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <h2 style={{ 
              marginBottom: '0.5rem', 
              textAlign: 'center',
              fontSize: '1.8rem' 
            }}>
              Select a Model
            </h2>
            <p style={{ 
              textAlign: 'center', 
              opacity: 0.8,
              marginBottom: '2rem'
            }}>
              Choose a pretrained model for your video analysis
            </p>

            <div style={{ 
              flex: 1,
              overflowY: 'auto',
              padding: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              {models.map(model => (
                <ModelCard
                  key={model._id}
                  model={model}
                  selected={model.name === modelName}
                  onClick={() => setModelName(model.name)}
                  onNext={() => setCurrentStep(1)}
                />
              ))}
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ 
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Upload Video</h2>
            {videoFile ? (
              <VideoPreview file={videoFile} onRemove={() => setVideoFile(null)} />
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  width: '100%',
                  minHeight: '260px',
                  border: `3px dashed ${dragActive ? '#ffffff' : 'rgba(255, 255, 255, 0.3)'}`,
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  background: dragActive 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow: dragActive 
                    ? '0 8px 32px rgba(31, 38, 135, 0.3)' 
                    : '0 4px 16px rgba(31, 38, 135, 0.1)'
                }}
              >
                <motion.div
                  animate={{
                    y: dragActive ? -10 : 0,
                    scale: dragActive ? 1.1 : 1
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div style={{ 
                    fontSize: '4rem', 
                    marginBottom: '1rem',
                    opacity: dragActive ? 1 : 0.7
                  }}>
                    {dragActive ? '📥' : '📁'}
                  </div>
                  <p style={{ 
                    fontSize: '1.2rem', 
                    marginBottom: '0.5rem',
                    color: dragActive ? '#fff' : 'rgba(255,255,255,0.8)'
                  }}>
                    {dragActive ? 'Drop your video here' : 'Drag and drop your video here'}
                  </p>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    opacity: 0.6,
                    marginBottom: '1rem'
                  }}>
                    or
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={e => setVideoFile(e.target.files?.[0])}
                    style={{ display: 'none' }}
                    id="video-input"
                  />
                  <label 
                    htmlFor="video-input"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      padding: '0.8rem 1.5rem',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    Browse Files
                  </label>
                </motion.div>
              </motion.div>
            )}
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '1.5rem'
            }}>
              <AnimatedButton
                onClick={() => setCurrentStep(0)}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                Back
              </AnimatedButton>
              <AnimatedButton
                onClick={() => videoFile && setCurrentStep(2)}
                disabled={!videoFile}
                style={{
                  flex: 2,
                  background: videoFile 
                    ? 'linear-gradient(90deg, #0072ff, #00c6ff)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  opacity: videoFile ? 1 : 0.5,
                  backdropFilter: 'blur(10px)'
                }}
              >
                Continue
              </AnimatedButton>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ 
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center'
            }}
          >
            <h2 style={{ marginBottom: '1rem' }}>Process Video</h2>
            <div style={{ marginBottom: '2rem' }}>
              <p>Model: <strong>{modelName}</strong></p>
              <p>Video: <strong>{videoFile.name}</strong></p>
            </div>
            {loading ? (
              <div style={{ width: '100%' }}>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #0072ff, #00c6ff)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ marginTop: '1rem' }}>{progress}% Complete</p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <AnimatedButton
                  onClick={() => setCurrentStep(1)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  Back
                </AnimatedButton>
                <AnimatedButton
                  onClick={handleInfer}
                  style={{
                    flex: 2,
                    background: 'linear-gradient(90deg, #0072ff, #00c6ff)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  Start Processing
                </AnimatedButton>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={containerStyle}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        style={formStyle}
      >
        <StepIndicator 
          currentStep={currentStep} 
          steps={['Select Model', 'Upload Video', 'Process']} 
        />

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                marginTop: '1rem',
                padding: '1rem',
                borderRadius: '10px',
                background: message.type === 'success' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)',
                color: 'white',
                width: '100%',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>
                {message.type === 'success' ? '✓' : '⚠️'}
              </span>
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default InferPretrainedModelVideo