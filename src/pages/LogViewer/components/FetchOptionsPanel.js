import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Box,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
  Tooltip,
  IconButton,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  GetApp,
  Refresh,
  Clear,
  DataUsage,
  AccessTime,
  Storage,
  Info,
  ExpandMore,
  DownloadForOffline,
  SettingsSuggest,
  Badge
} from '@mui/icons-material';

const FetchOptionsPanel = ({
  fetchOption,
  setFetchOption,
  linesCount,
  setLinesCount,
  sinceTimestamp,
  setSinceTimestamp,
  byteOffset,
  setByteOffset,
  fetchLogs,
  handleClear,
  handleDownload,
  loading,
  logInfo
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  
  // Determine if timestamp is valid
  const isValidTimestamp = () => {
    if (!sinceTimestamp) return true;
    const date = new Date(sinceTimestamp);
    return !isNaN(date.getTime());
  };
  
  // Determine if inputs are valid
  const areInputsValid = () => {
    if (fetchOption === 'lastNLines') {
      return linesCount > 0;
    } else if (fetchOption === 'sinceTimestamp') {
      return isValidTimestamp();
    } else if (fetchOption === 'byteOffset') {
      return byteOffset >= 0;
    }
    return true;
  };

  // Auto expand on mobile devices
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setExpanded(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Format bytes to human readable format
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <Accordion 
      expanded={expanded} 
      onChange={() => setExpanded(!expanded)} 
      elevation={3}
      sx={{
        borderRadius: '8px',
        mb: 3,
        overflow: 'hidden',
        '&:before': {
          display: 'none'
        },
        '& .MuiAccordionSummary-root': {
          bgcolor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.primary.dark, 0.2)
            : alpha(theme.palette.primary.light, 0.1)
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{ 
          borderBottom: expanded ? `1px solid ${alpha(theme.palette.divider, 0.2)}` : 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DataUsage sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" component="div">
            Log Fetch Options
          </Typography>
          
          {logInfo && (
            <Chip 
              size="small" 
              label={`${formatBytes(logInfo.size)}`}
              icon={<Storage fontSize="small" />}
              sx={{ ml: 2 }}
            />
          )}
        </Box>
      </AccordionSummary>
      
      <AccordionDetails sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Main options */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              bgcolor: alpha(theme.palette.background.default, 0.5),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <SettingsSuggest sx={{ mr: 1, fontSize: 20 }} />
                Fetch Configuration
              </Typography>
              
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="fetch-option-label">Fetch Option</InputLabel>
                <Select
                  labelId="fetch-option-label"
                  id="fetch-option"
                  value={fetchOption}
                  onChange={(e) => setFetchOption(e.target.value)}
                  label="Fetch Option"
                >
                  <MenuItem value="lastNLines">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Badge sx={{ mr: 1 }} />
                      Last N Lines
                    </Box>
                  </MenuItem>
                  <MenuItem value="allLines">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Badge sx={{ mr: 1 }} />
                      Show All Lines
                    </Box>
                  </MenuItem>
                  <MenuItem value="sinceTimestamp">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ mr: 1 }} />
                      Since Timestamp
                    </Box>
                  </MenuItem>
                  <MenuItem value="byteOffset">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Storage sx={{ mr: 1 }} />
                      From Byte Offset
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {fetchOption === 'lastNLines' && (
                <>
                  <TextField
                    label="Number of Lines"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={linesCount}
                    onChange={(e) => setLinesCount(Math.max(1, parseInt(e.target.value) || 0))}
                    InputProps={{
                      inputProps: { min: 1 },
                      startAdornment: <Badge sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                    error={linesCount <= 0}
                    helperText={linesCount <= 0 ? "Number of lines must be positive" : "Enter any number of recent log lines to fetch"}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <Button size="small" variant="outlined" onClick={() => setLinesCount(100)}>100</Button>
                    <Button size="small" variant="outlined" onClick={() => setLinesCount(1000)}>1,000</Button>
                    <Button size="small" variant="outlined" onClick={() => setLinesCount(5000)}>5,000</Button>
                    <Button size="small" variant="outlined" onClick={() => setLinesCount(10000)}>10,000</Button>
                  </Box>
                </>
              )}

              {fetchOption === 'sinceTimestamp' && (
                <TextField
                  label="Timestamp (ISO format)"
                  fullWidth
                  variant="outlined"
                  value={sinceTimestamp}
                  onChange={(e) => setSinceTimestamp(e.target.value)}
                  placeholder="YYYY-MM-DDTHH:MM:SS.sssZ"
                  InputProps={{
                    startAdornment: <AccessTime sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  error={sinceTimestamp && !isValidTimestamp()}
                  helperText={sinceTimestamp && !isValidTimestamp() ? 
                    "Invalid timestamp format" : 
                    "Enter an ISO timestamp (YYYY-MM-DDTHH:MM:SS.sssZ)"}
                />
              )}

              {fetchOption === 'byteOffset' && (
                <TextField
                  label="Byte Offset"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={byteOffset}
                  onChange={(e) => setByteOffset(Math.max(0, parseInt(e.target.value) || 0))}
                  InputProps={{
                    inputProps: { min: 0 },
                    startAdornment: <Storage sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  error={byteOffset < 0}
                  helperText={byteOffset < 0 ? 
                    "Byte offset must be non-negative" : 
                    "Enter the byte position to start fetching from"}
                />
              )}
              
              {advancedOptions && (
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={<Switch size="small" />}
                    label="Follow log tail"
                    disabled
                  />
                  <FormControlLabel
                    control={<Switch size="small" />}
                    label="Parse JSON automatically"
                    disabled
                  />
                </Box>
              )}
              
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      size="small" 
                      checked={advancedOptions}
                      onChange={() => setAdvancedOptions(!advancedOptions)}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Advanced options
                    </Typography>
                  }
                />
              </Box>
            </Box>
          </Grid>
          
          {/* Log info and actions */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 2, 
              borderRadius: 1, 
              bgcolor: alpha(theme.palette.background.default, 0.5),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Info sx={{ mr: 1, fontSize: 20 }} />
                Log Information
              </Typography>
              
              {logInfo ? (
                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Size:</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatBytes(logInfo.size)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Last Modified:</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {new Date(logInfo.lastModified).toLocaleString()}
                      </Typography>
                    </Grid>
                    {logInfo.lineCount !== undefined && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Total Lines:</Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {logInfo.lineCount.toLocaleString()}
                        </Typography>
                      </Grid>
                    )}
                    {logInfo.logName && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Log Name:</Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {logInfo.logName}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              ) : (
                <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    No log information available. Fetch logs to see details.
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Clear />}
                  onClick={handleClear}
                  disabled={loading}
                  sx={{ borderRadius: '8px' }}
                >
                  Clear
                </Button>
                
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<GetApp />}
                  onClick={handleDownload}
                  disabled={loading}
                  sx={{ borderRadius: '8px' }}
                >
                  Download
                </Button>
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
                  onClick={fetchLogs}
                  disabled={loading || !areInputsValid()}
                  sx={{ borderRadius: '8px' }}
                >
                  {loading ? "Fetching..." : "Fetch Logs"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default FetchOptionsPanel; 