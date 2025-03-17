import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Tooltip,
  Tab,
  Tabs
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  Brush,
  ReferenceLine
} from 'recharts';
import {
  Speed,
  DirectionsRun,
  Visibility,
  BarChart as BarChartIcon,
  ShowChart,
  Memory,
  VideoSettings,
  VideoCall,
  FormatListBulleted
} from '@mui/icons-material';
import { LogUtils } from './';

const PerformanceMetricsSummary = ({ logs }) => {
  const theme = useTheme();
  const [selectedChart, setSelectedChart] = useState('fps');
  const [selectedStream, setSelectedStream] = useState('all');
  const [chartType, setChartType] = useState('line');
  const [tabIndex, setTabIndex] = useState(0);

  const metrics = useMemo(() => {
    // Process all logs to extract performance data
    const streamData = {};
    const timeSeriesData = {};

    logs.forEach(log => {
      const metrics = LogUtils.parseStreamMetrics(log.message);
      if (metrics) {
        // Initialize stream data if it doesn't exist
        if (!streamData[metrics.streamId]) {
          streamData[metrics.streamId] = {
            avgFps: 0,
            minFps: Infinity,
            maxFps: -Infinity,
            avgFrameSkip: 0,
            maxFrameSkip: 0,
            currentFrameSkip: 0,
            avgEfficiency: 0,
            samples: 0,
            fpsSamples: [],
            efficiencySamples: [],
            frameSkipSamples: []
          };
        }

        // Update data for this stream
        const data = streamData[metrics.streamId];
        data.avgFps += metrics.fps;
        data.minFps = Math.min(data.minFps, metrics.fps);
        data.maxFps = Math.max(data.maxFps, metrics.fps);
        data.avgFrameSkip += metrics.frameSkip;
        data.maxFrameSkip = Math.max(data.maxFrameSkip, metrics.frameSkip);
        data.currentFrameSkip = metrics.frameSkip; // Most recent frame skip value
        data.avgEfficiency += metrics.efficiency;
        data.samples++;

        // Store time series data if timestamp is available
        if (log.timestamp) {
          try {
            const timestamp = new Date(log.timestamp).toISOString();
            data.fpsSamples.push({ timestamp, value: metrics.fps });
            data.efficiencySamples.push({ timestamp, value: metrics.efficiency });
            data.frameSkipSamples.push({ timestamp, value: metrics.frameSkip });

            // Also store all metrics in a time series format for charts
            const timeKey = new Date(log.timestamp).getTime();
            if (!timeSeriesData[timeKey]) {
              timeSeriesData[timeKey] = {
                timestamp,
                displayTime: new Date(log.timestamp).toLocaleTimeString(),
                streams: {}
              };
            }
            
            timeSeriesData[timeKey].streams[metrics.streamId] = {
              fps: metrics.fps,
              efficiency: metrics.efficiency,
              frameSkip: metrics.frameSkip
            };
          } catch (err) {
            // Ignore timestamp parsing errors
          }
        }
      }
    });

    // Calculate averages
    Object.values(streamData).forEach(data => {
      data.avgFps = data.avgFps / data.samples;
      data.avgFrameSkip = data.avgFrameSkip / data.samples;
      data.avgEfficiency = data.avgEfficiency / data.samples;
    });

    // Convert time series to array and sort
    const timeSeriesArray = Object.values(timeSeriesData).sort((a, b) => {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });

    return {
      streamData,
      timeSeriesArray
    };
  }, [logs]);

  // Format data for charts based on selected options
  const chartData = useMemo(() => {
    if (!metrics.timeSeriesArray.length) return [];
    
    // Filter for selected stream or aggregate all streams
    return metrics.timeSeriesArray.map(point => {
      const result = {
        timestamp: point.displayTime,
        rawTimestamp: point.timestamp
      };
      
      if (selectedStream === 'all') {
        // Average values across all streams
        let fpsSum = 0;
        let efficiencySum = 0;
        let frameSkipSum = 0;
        let streamCount = 0;
        
        Object.values(point.streams).forEach(stream => {
          fpsSum += stream.fps;
          efficiencySum += stream.efficiency;
          frameSkipSum += stream.frameSkip;
          streamCount++;
        });
        
        result.fps = streamCount ? fpsSum / streamCount : 0;
        result.efficiency = streamCount ? efficiencySum / streamCount : 0;
        result.frameSkip = streamCount ? frameSkipSum / streamCount : 0;
      } else if (point.streams[selectedStream]) {
        // Use data from the selected stream
        result.fps = point.streams[selectedStream].fps;
        result.efficiency = point.streams[selectedStream].efficiency;
        result.frameSkip = point.streams[selectedStream].frameSkip;
      } else {
        // Set zero values if selected stream not found
        result.fps = 0;
        result.efficiency = 0;
        result.frameSkip = 0;
      }
      
      return result;
    });
  }, [metrics, selectedStream]);

  // Get list of all streams
  const streamList = useMemo(() => {
    return Object.keys(metrics.streamData).sort();
  }, [metrics]);

  // No data message if no streams found
  if (Object.keys(metrics.streamData).length === 0) {
    return (
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>Stream Performance Summary</Typography>
        <Box sx={{ 
          py: 10, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <VideoSettings sx={{ fontSize: 60, color: theme.palette.action.disabled, mb: 2 }} />
          <Typography variant="subtitle1" color="text.secondary">
            No performance metrics data available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Connect streams to see performance metrics
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1.5, boxShadow: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="subtitle2" gutterBottom>Time: {label}</Typography>
          {payload.map((entry, index) => (
            <Box 
              key={`item-${index}`} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 0.5
              }}
            >
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  backgroundColor: entry.color,
                  mr: 1,
                  borderRadius: '50%'
                }} 
              />
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {entry.name}: <b>{entry.value.toFixed(2)}{entry.unit || ''}</b>
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  // Handle chart type change
  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  // Handle metrics type change
  const handleMetricsChange = (event, newValue) => {
    setSelectedChart(newValue);
  };

  // Handle stream selection change
  const handleStreamChange = (event, newValue) => {
    setTabIndex(newValue);
    setSelectedStream(newValue === 0 ? 'all' : streamList[newValue - 1]);
  };

  // Get specific chart data based on selected metric
  const getChartData = () => {
    let dataKey, name, color, unit;
    
    switch (selectedChart) {
      case 'fps':
        dataKey = 'fps';
        name = 'FPS';
        color = '#4caf50';
        unit = '';
        break;
      case 'efficiency':
        dataKey = 'efficiency';
        name = 'Efficiency';
        color = '#2196f3';
        unit = '%';
        break;
      case 'frameSkip':
        dataKey = 'frameSkip';
        name = 'Frame Skips';
        color = '#f44336';
        unit = '';
        break;
      default:
        dataKey = 'fps';
        name = 'FPS';
        color = '#4caf50';
        unit = '';
    }
    
    return { dataKey, name, color, unit };
  };

  // Render the appropriate chart type
  const renderChart = () => {
    const { dataKey, name, color, unit } = getChartData();
    
    if (chartType === 'line') {
      return (
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }}
            stroke={theme.palette.text.secondary}
          />
          <YAxis 
            unit={unit} 
            tick={{ fontSize: 12 }}
            stroke={theme.palette.text.secondary}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey={dataKey}
            name={name}
            stroke={color}
            strokeWidth={2}
            dot={false}
            unit={unit}
            activeDot={{ r: 8 }}
          />
          <Brush 
            dataKey="timestamp" 
            height={30} 
            stroke={theme.palette.primary.main}
            fill="transparent"
          />
          {/* Add reference lines for common thresholds */}
          {dataKey === 'fps' && (
            <>
              <ReferenceLine 
                y={30} 
                label={{ value: 'Target', position: 'insideTopLeft' }} 
                stroke="#4caf50" 
                strokeDasharray="3 3" 
              />
              <ReferenceLine 
                y={20} 
                label={{ value: 'Min Acceptable', position: 'insideTopLeft' }} 
                stroke="#ff9800" 
                strokeDasharray="3 3" 
              />
            </>
          )}
        </LineChart>
      );
    } else if (chartType === 'area') {
      return (
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }}
            stroke={theme.palette.text.secondary}
          />
          <YAxis 
            unit={unit} 
            tick={{ fontSize: 12 }}
            stroke={theme.palette.text.secondary}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey={dataKey}
            name={name}
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            unit={unit}
          />
          <Brush 
            dataKey="timestamp" 
            height={30} 
            stroke={theme.palette.primary.main}
            fill="transparent"
          />
        </AreaChart>
      );
    } else {
      return (
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fontSize: 12 }}
            stroke={theme.palette.text.secondary}
          />
          <YAxis 
            unit={unit} 
            tick={{ fontSize: 12 }}
            stroke={theme.palette.text.secondary}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Bar 
            dataKey={dataKey}
            name={name}
            fill={color}
            unit={unit}
          />
          <Brush 
            dataKey="timestamp" 
            height={30} 
            stroke={theme.palette.primary.main}
            fill="transparent"
          />
        </BarChart>
      );
    }
  };

  // Generate stream performance cards
  const renderStreamCards = () => {
    return Object.entries(metrics.streamData).map(([streamId, data]) => {
      // Calculate health status
      let healthStatus, healthColor;
      if (data.avgFps >= 25 && data.avgEfficiency >= 80) {
        healthStatus = 'Excellent';
        healthColor = '#4caf50';
      } else if (data.avgFps >= 20 && data.avgEfficiency >= 70) {
        healthStatus = 'Good';
        healthColor = '#2196f3';
      } else if (data.avgFps >= 15 && data.avgEfficiency >= 60) {
        healthStatus = 'Fair';
        healthColor = '#ff9800';
      } else {
        healthStatus = 'Poor';
        healthColor = '#f44336';
      }

      return (
        <Grid item xs={12} md={6} key={streamId}>
          <Card 
            elevation={3} 
            sx={{ 
              borderRadius: 2,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: healthColor }}>
                  <VideoCall />
                </Avatar>
              }
              title={`Stream: ${streamId}`}
              subheader={`Health: ${healthStatus}`}
              action={
                <Tooltip title="View details">
                  <IconButton 
                    onClick={() => {
                      setSelectedStream(streamId);
                      setTabIndex(streamList.indexOf(streamId) + 1);
                    }}
                  >
                    <FormatListBulleted />
                  </IconButton>
                </Tooltip>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      p: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 2
                    }}
                  >
                    <Speed sx={{ color: data.avgFps < 20 ? '#ff9800' : '#4caf50', mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Avg FPS
                    </Typography>
                    <Typography 
                      variant="h5" 
                      color={data.avgFps < 20 ? 'warning.main' : 'success.main'}
                      fontWeight="bold"
                    >
                      {data.avgFps.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Range: {data.minFps.toFixed(1)} - {data.maxFps.toFixed(1)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      p: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 2
                    }}
                  >
                    <Memory sx={{ color: '#2196f3', mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Efficiency
                    </Typography>
                    <Typography 
                      variant="h5" 
                      color="primary"
                      fontWeight="bold"
                    >
                      {data.avgEfficiency.toFixed(1)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Processing Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      p: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 2
                    }}
                  >
                    <DirectionsRun sx={{ color: data.maxFrameSkip > 5 ? '#f44336' : '#9e9e9e', mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Frame Skips
                    </Typography>
                    <Typography 
                      variant="h5" 
                      color={data.maxFrameSkip > 5 ? 'error.main' : 'text.secondary'}
                      fontWeight="bold"
                    >
                      {data.maxFrameSkip}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Max: {data.maxFrameSkip} | Avg: {data.avgFrameSkip.toFixed(1)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      );
    });
  };

  return (
    <Paper sx={{ 
      p: 2, 
      mb: 2, 
      borderRadius: 2, 
      boxShadow: 3,
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(to right, #121212, #1e1e1e)' 
        : 'linear-gradient(to right, #f5f5f5, #ffffff)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <VideoSettings sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold">Stream Performance Summary</Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Stream Selection Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleStreamChange} 
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            label="All Streams" 
            icon={<Visibility />} 
            iconPosition="start"
          />
          {streamList.map(streamId => (
            <Tab 
              key={streamId} 
              label={`Stream ${streamId}`} 
              icon={<VideoCall />} 
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>
      
      {/* Chart Controls */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        mb: 2,
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <ToggleButtonGroup
          value={selectedChart}
          exclusive
          onChange={handleMetricsChange}
          aria-label="metrics type"
          size="small"
        >
          <ToggleButton value="fps" aria-label="fps">
            <Speed sx={{ mr: 1 }} /> FPS
          </ToggleButton>
          <ToggleButton value="efficiency" aria-label="efficiency">
            <Memory sx={{ mr: 1 }} /> Efficiency
          </ToggleButton>
          <ToggleButton value="frameSkip" aria-label="frame skips">
            <DirectionsRun sx={{ mr: 1 }} /> Frame Skips
          </ToggleButton>
        </ToggleButtonGroup>
        
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          aria-label="chart type"
          size="small"
        >
          <ToggleButton value="line" aria-label="line chart">
            <ShowChart />
          </ToggleButton>
          <ToggleButton value="area" aria-label="area chart">
            <ShowChart />
          </ToggleButton>
          <ToggleButton value="bar" aria-label="bar chart">
            <BarChartIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {/* Main Chart */}
      <Box sx={{ height: 400, mb: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </Box>
      
      {/* Stream Cards */}
      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
        Stream Performance Details
      </Typography>
      <Grid container spacing={2}>
        {renderStreamCards()}
      </Grid>
    </Paper>
  );
};

export default PerformanceMetricsSummary; 