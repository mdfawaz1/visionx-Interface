import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Stack,
  Pagination,
  Card,
  CardContent,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Error,
  Warning,
  Info,
  Check,
  ContentCopy,
  Visibility,
  VisibilityOff,
  ArrowDownward,
  ArrowUpward,
  Bookmark,
  BookmarkBorder,
  CallMade,
  CallReceived,
  Speed
} from '@mui/icons-material';
import Highlight from 'react-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { LogEntry } from './';

const LogContentViewer = ({
  logs = [],
  isLoading = false,
  darkMode = false,
  viewMode = 'formatted',
  currentPage = 1,
  setCurrentPage = () => {},
  itemsPerPage = 10,
  searchText = '',
  totalPages = 1
}) => {
  const theme = useTheme();
  const endRef = useRef(null);
  const [copied, setCopied] = useState(null);
  const [expandedLogs, setExpandedLogs] = useState({});
  const [bookmarkedLogs, setBookmarkedLogs] = useState({});

  // Function to copy log content
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  // Function to toggle log expansion
  const toggleLogExpansion = (index) => {
    setExpandedLogs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Function to toggle log bookmark
  const toggleBookmark = (index) => {
    setBookmarkedLogs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Scroll to bottom when logs change if we're on the last page
  useEffect(() => {
    if (currentPage === totalPages && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, currentPage, totalPages]);

  // Function to get style based on log level
  const getLevelStyle = (level) => {
    if (!level) return { color: theme.palette.text.primary, bg: alpha(theme.palette.grey[500], 0.1) };
    
    level = level.toLowerCase();
    
    if (level.includes('error') || level.includes('critical') || level.includes('fatal')) {
      return {
        color: theme.palette.error.main,
        bg: alpha(theme.palette.error.main, 0.1),
        icon: <Error fontSize="small" />,
        borderColor: theme.palette.error.main
      };
    } else if (level.includes('warn')) {
      return {
        color: theme.palette.warning.main,
        bg: alpha(theme.palette.warning.main, 0.1),
        icon: <Warning fontSize="small" />,
        borderColor: theme.palette.warning.main
      };
    } else if (level.includes('info')) {
      return {
        color: theme.palette.info.main,
        bg: alpha(theme.palette.info.main, 0.1),
        icon: <Info fontSize="small" />,
        borderColor: theme.palette.info.main
      };
    } else if (level.includes('debug')) {
      return {
        color: theme.palette.success.main,
        bg: alpha(theme.palette.success.main, 0.1),
        icon: <Check fontSize="small" />,
        borderColor: theme.palette.success.main
      };
    }
    
    return {
      color: theme.palette.text.primary,
      bg: alpha(theme.palette.grey[500], 0.1),
      icon: <Info fontSize="small" />,
      borderColor: theme.palette.grey[500]
    };
  };

  // Function to highlight search text in a string
  const highlightSearchText = (text) => {
    if (!searchText || !text) return text;
    
    try {
      const parts = text.split(new RegExp(`(${searchText})`, 'gi'));
      return (
        <>
          {parts.map((part, i) => 
            part.toLowerCase() === searchText.toLowerCase() ? 
              <span key={i} style={{ backgroundColor: alpha(theme.palette.warning.main, 0.4), fontWeight: 'bold' }}>
                {part}
              </span> : 
              part
          )}
        </>
      );
    } catch (e) {
      return text;
    }
  };

  const renderFormattedLog = (log, index) => {
    const isExpanded = expandedLogs[index] === true;
    const isBookmarked = bookmarkedLogs[index] === true;
    
    // Determine which property to use as content (message, __raw, or stringify the object)
    let logContent = '';
    if (log.message) {
      logContent = log.message;
    } else if (log.__raw) {
      logContent = log.__raw;
    } else {
      // If no message or __raw, stringify the entire log object except for special properties
      const logCopy = {...log};
      ['__lineNumber', '__error'].forEach(key => delete logCopy[key]);
      logContent = JSON.stringify(logCopy, null, 2);
    }
    
    // Try to parse JSON if log content looks like JSON
    let jsonObject = null;
    let isStreamChange = false;
    let isPerformanceLog = false;
    let isWebSocketEvent = false;
    let isFrameData = false;
    
    try {
      // Only try to parse if content is a string and looks like JSON
      if (typeof logContent === 'string' && 
          (logContent.trim().startsWith('{') || logContent.trim().startsWith('['))) {
        jsonObject = JSON.parse(logContent);
        
        // Check for special log types
        isStreamChange = jsonObject && jsonObject.event === 'stream_change';
        isPerformanceLog = jsonObject && jsonObject.fps !== undefined;
        isWebSocketEvent = jsonObject && (jsonObject.event === 'websocket_open' || 
                                         jsonObject.event === 'websocket_close' ||
                                         jsonObject.event === 'websocket_message');
        isFrameData = jsonObject && jsonObject.frame_data !== undefined;
      }
    } catch (e) {
      // Not JSON or invalid JSON, use as-is
      jsonObject = null;
    }
    
    // Get style based on level
    const levelStyle = getLevelStyle(log.level);
    
    return (
      <Card 
        elevation={isBookmarked ? 4 : 1} 
        key={index}
        sx={{
          mb: 2,
          borderLeft: `4px solid ${levelStyle.borderColor}`,
          borderRadius: 1,
          position: 'relative',
          overflow: 'visible',
          transition: 'all 0.2s ease',
          transform: isBookmarked ? 'scale(1.005)' : 'scale(1)',
          bgcolor: isBookmarked ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
          '&:hover': {
            boxShadow: theme.shadows[isBookmarked ? 8 : 3]
          }
        }}
      >
        {isBookmarked && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              zIndex: 1
            }}
          >
            <IconButton 
              size="small" 
              onClick={() => toggleBookmark(index)}
              sx={{ 
                color: theme.palette.primary.main,
                bgcolor: theme.palette.background.paper,
                boxShadow: theme.shadows[2]
              }}
            >
              <Bookmark fontSize="small" />
            </IconButton>
          </Box>
        )}
          
        <CardContent sx={{ p: 2 }}>
          {/* Header */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                label={log.level || 'INFO'}
                size="small"
                icon={levelStyle.icon}
                sx={{
                  bgcolor: levelStyle.bg,
                  color: levelStyle.color,
                  borderRadius: '4px',
                  mr: 1
                }}
              />
              
              {log.stream && (
                <Chip
                  label={log.stream}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderRadius: '4px',
                    mr: 1
                  }}
                />
              )}
              
              <Typography variant="caption" color="text.secondary">
                {log.timestamp || new Date().toISOString()}
              </Typography>
            </Box>
            
            <Box>
              <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark this log"}>
                <IconButton 
                  size="small" 
                  onClick={() => toggleBookmark(index)}
                  sx={{ color: isBookmarked ? theme.palette.primary.main : 'text.secondary' }}
                >
                  {isBookmarked ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title={isExpanded ? "Collapse" : "Expand"}>
                <IconButton 
                  size="small" 
                  onClick={() => toggleLogExpansion(index)}
                  sx={{ color: 'text.secondary' }}
                >
                  {isExpanded ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title={copied === index ? "Copied!" : "Copy to clipboard"}>
                <IconButton 
                  size="small" 
                  onClick={() => copyToClipboard(logContent, index)}
                  sx={{ color: copied === index ? theme.palette.success.main : 'text.secondary' }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {/* Special log indicator */}
          {(isStreamChange || isPerformanceLog || isWebSocketEvent || isFrameData) && (
            <Box sx={{ mb: 1 }}>
              <Chip
                label={
                  isStreamChange ? "Stream Change" : 
                  isPerformanceLog ? "Performance Metrics" : 
                  isWebSocketEvent ? "WebSocket Event" : 
                  "Frame Data"
                }
                size="small"
                color={
                  isStreamChange ? "primary" : 
                  isPerformanceLog ? "success" : 
                  isWebSocketEvent ? "info" : 
                  "secondary"
                }
                icon={
                  isStreamChange ? <CallMade fontSize="small" /> : 
                  isPerformanceLog ? <Speed fontSize="small" /> : 
                  isWebSocketEvent ? <CallReceived fontSize="small" /> : 
                  null
                }
                sx={{ borderRadius: '4px' }}
              />
              
              {isPerformanceLog && jsonObject && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Tooltip title="Frames Per Second">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ mr: 1 }}>FPS:</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, (jsonObject.fps / 60) * 100)}
                        sx={{ 
                          width: 100, 
                          height: 8, 
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.grey[500], 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: jsonObject.fps < 20 ? theme.palette.error.main : 
                                    jsonObject.fps < 40 ? theme.palette.warning.main : 
                                    theme.palette.success.main
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {jsonObject.fps.toFixed(1)}
                      </Typography>
                    </Box>
                  </Tooltip>
                  
                  {jsonObject.frame_time !== undefined && (
                    <Tooltip title="Frame Time (ms)">
                      <Typography variant="caption">
                        {jsonObject.frame_time.toFixed(2)}ms
                      </Typography>
                    </Tooltip>
                  )}
                </Box>
              )}
            </Box>
          )}
          
          {/* Content */}
          <Box
            sx={{
              position: 'relative',
              mt: 1,
              transition: 'all 0.3s ease',
              maxHeight: isExpanded ? 'none' : '150px',
              overflow: isExpanded ? 'visible' : 'hidden',
              zIndex: isExpanded ? 10 : 1
            }}
          >
            {!isExpanded && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '70px',
                  background: `linear-gradient(to top, ${theme.palette.background.paper}, transparent)`,
                  zIndex: 1
                }}
              />
            )}
            
            {viewMode === 'raw' ? (
              <Box
                sx={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  p: 1,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.grey[900], darkMode ? 0.4 : 0.03),
                  color: theme.palette.text.primary
                }}
              >
                {typeof logContent === 'string' && logContent.length > 0 ? 
                  highlightSearchText(logContent) : 
                  <Typography color="text.secondary" variant="body2">
                    No content available or empty log entry
                  </Typography>
                }
              </Box>
            ) : (
              jsonObject ? (
                <Highlight className="json">
                  {JSON.stringify(jsonObject, null, 2)}
                </Highlight>
              ) : (
                <Box
                  sx={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.grey[900], darkMode ? 0.4 : 0.03),
                    color: theme.palette.text.primary
                  }}
                >
                  {typeof logContent === 'string' && logContent.length > 0 ?
                    highlightSearchText(logContent) :
                    <Typography color="text.secondary" variant="body2">
                      No formatted content available
                    </Typography>
                  }
                </Box>
              )
            )}
            
            {/* Debug info when expanded */}
            {isExpanded && (
              <Box sx={{ mt: 2, p: 1, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Log type: {log.__raw ? 'Raw log' : (log.message ? 'Message log' : 'JSON log')} | 
                  Content length: {typeof logContent === 'string' ? logContent.length : 'N/A'} | 
                  Is JSON: {jsonObject ? 'Yes' : 'No'}
                </Typography>
              </Box>
            )}
            
            {!isExpanded && logContent && logContent.length > 200 && (
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Chip
                  label="Show more"
                  size="small"
                  onClick={() => toggleLogExpansion(index)}
                  icon={<ArrowDownward fontSize="small" />}
                  variant="outlined"
                />
              </Box>
            )}
            
            {isExpanded && (
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Chip
                  label="Show less"
                  size="small"
                  onClick={() => toggleLogExpansion(index)}
                  icon={<ArrowUpward fontSize="small" />}
                  variant="outlined"
                />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        minHeight: 400,
        mb: 4,
        position: 'relative'
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <LinearProgress sx={{ width: '100%', borderRadius: '2px 2px 0 0' }} />
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="medium">
          Log Content
          {logs.length > 0 && (
            <Badge
              badgeContent={logs.length}
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        
        {/* Pagination for desktop */}
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            size="small"
            sx={{ display: { xs: 'none', md: 'flex' } }}
          />
        )}
      </Box>
      
      {logs.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            minHeight: 300
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Loading logs...
              </Typography>
            </>
          ) : (
            <>
              <Info sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No logs available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or fetch more logs
              </Typography>
            </>
          )}
        </Box>
      ) : (
        <>
          <Box>
            {logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((log, index) => renderFormattedLog(log, index))}
            <div ref={endRef} />
          </Box>
          
          {/* Pagination for mobile */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, display: { xs: 'flex', md: 'none' } }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                size="small"
              />
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default LogContentViewer; 