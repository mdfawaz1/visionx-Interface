import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress
} from '@mui/material';
import { ContentCopy, ExpandMore, PhotoCamera } from '@mui/icons-material';
import { LogUtils } from './';

const LogEntry = ({ log, index, viewMode, darkMode, copyToClipboard }) => {
  // Handle parse errors or raw text
  if (log.__error) {
    return (
      <Paper 
        key={`log-${log.__lineNumber}`}
        sx={{ 
          p: 1, 
          mb: 1, 
          backgroundColor: '#f8e7e9',
          border: '1px solid #dc3545',
          overflowX: 'auto'
        }}
      >
        <Typography fontFamily="monospace" fontSize="0.9rem">
          {log.__raw}
        </Typography>
      </Paper>
    );
  }
  
  // Get log level for styling
  const level = log.level?.toLowerCase() || 'info';
  const levelStyle = LogUtils.LOG_LEVELS[level] || { color: '#000', backgroundColor: '#f8f9fa' };
  
  // Check if this is a stream metrics log
  const streamMetrics = log.message ? LogUtils.parseStreamMetrics(log.message) : null;
  
  // Display formatted JSON
  if (viewMode === 'formatted') {
    return (
      <Accordion 
        key={`log-${log.__lineNumber}`}
        disableGutters
        sx={{ 
          mb: 1,
          backgroundColor: darkMode ? '#1e1e1e' : levelStyle.backgroundColor,
          color: darkMode ? '#fff' : levelStyle.color,
          border: `1px solid ${darkMode ? '#333' : levelStyle.color}`
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Chip 
                label={level.toUpperCase()} 
                size="small"
                sx={{ 
                  backgroundColor: levelStyle.color,
                  color: '#fff',
                  fontWeight: 'bold'
                }} 
              />
            </Grid>
            {streamMetrics ? (
              <>
                <Grid item>
                  <Chip 
                    label={`Stream: ${streamMetrics.streamId}`}
                    size="small"
                    sx={{ backgroundColor: '#2196f3', color: '#fff' }}
                  />
                </Grid>
                <Grid item>
                  <Chip 
                    label={`FPS: ${streamMetrics.fps.toFixed(2)}`}
                    size="small"
                    sx={{ 
                      backgroundColor: streamMetrics.fps < 20 ? '#ff9800' : '#4caf50',
                      color: '#fff'
                    }}
                  />
                </Grid>
                {streamMetrics.frameSkip > 0 && (
                  <Grid item>
                    <Chip 
                      label={`Skipped: ${streamMetrics.frameSkip}`}
                      size="small"
                      color="error"
                    />
                  </Grid>
                )}
                <Grid item>
                  <Chip 
                    label={`Efficiency: ${streamMetrics.efficiency}%`}
                    size="small"
                    sx={{ 
                      backgroundColor: '#673ab7',
                      color: '#fff'
                    }}
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs>
                <Typography variant="body2" noWrap>
                  {log.message || log.msg || 'No message'}
                </Typography>
              </Grid>
            )}
            <Grid item>
              <Typography variant="caption" color="text.secondary">
                {log.timestamp || log.time || ''}
              </Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Tooltip title="Copy as JSON">
              <IconButton 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(JSON.stringify(log, null, 2));
                }}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Divider sx={{ mb: 1 }} />
          {streamMetrics && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Stream Performance Metrics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" display="block" color="white">
                      FPS Trend
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(streamMetrics.fps / 30) * 100}
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: streamMetrics.fps < 20 ? '#ff9800' : '#4caf50'
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" display="block" color="white">
                      Processing Efficiency
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={streamMetrics.efficiency}
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#673ab7'
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
          <Box
            sx={{
              '& pre': { margin: 0 },
              '& code': { 
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                backgroundColor: 'transparent'
              }
            }}
            dangerouslySetInnerHTML={{ 
              __html: LogUtils.formatJson(
                Object.fromEntries(
                  Object.entries(log).filter(([key]) => !key.startsWith('__'))
                )
              )
            }}
          />
        </AccordionDetails>
      </Accordion>
    );
  } else {
    // Raw mode
    return (
      <Box 
        key={`log-${log.__lineNumber}`}
        sx={{ 
          p: 0.5, 
          borderLeft: `3px solid ${levelStyle.color}`,
          mb: 0.5,
          backgroundColor: darkMode ? '#1e1e1e' : 'transparent',
          color: darkMode ? '#fff' : 'inherit',
        }}
      >
        <Typography 
          component="pre" 
          sx={{ 
            m: 0, 
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            overflowX: 'auto'
          }}
        >
          {log.__raw || JSON.stringify(log, null, 2)}
        </Typography>
      </Box>
    );
  }
};

export default LogEntry; 