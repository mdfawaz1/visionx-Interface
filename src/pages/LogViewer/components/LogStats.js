import React, { useMemo } from 'react';
import { 
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  useTheme,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis
} from 'recharts';
import {
  Assessment, 
  BugReport, 
  Speed, 
  NetworkCheck,
  Error as ErrorIcon, 
  Info as InfoIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { LogUtils } from './';

const LogStats = ({ logs }) => {
  const theme = useTheme();
  
  const stats = useMemo(() => {
    const result = {
      totalLogs: logs.length,
      byLevel: {},
      byStream: new Set(),
      byHour: {},
      avgFps: 0,
      fpsReadings: 0,
      errorCount: 0,
      websocketEvents: 0,
      timeDistribution: {}
    };

    logs.forEach(log => {
      // Count by level
      const level = log.level?.toLowerCase() || 'unknown';
      result.byLevel[level] = (result.byLevel[level] || 0) + 1;

      // Parse stream metrics
      const metrics = LogUtils.parseStreamMetrics(log.message);
      if (metrics) {
        result.byStream.add(metrics.streamId);
        result.avgFps += metrics.fps;
        result.fpsReadings++;
      }

      // Count errors and websocket events
      if (level === 'error') result.errorCount++;
      if (log.message?.includes('WebSocket')) result.websocketEvents++;
      
      // Track logs by hour for time distribution
      try {
        if (log.timestamp) {
          const date = new Date(log.timestamp);
          const hour = date.getHours();
          const hourKey = `${hour}:00`;
          result.byHour[hourKey] = (result.byHour[hourKey] || 0) + 1;
        }
      } catch (err) {
        // Ignore timestamp parsing errors
      }
    });

    // Calculate average FPS
    if (result.fpsReadings > 0) {
      result.avgFps = result.avgFps / result.fpsReadings;
    }

    return result;
  }, [logs]);

  // Prepare data for pie chart
  const levelChartData = useMemo(() => {
    return Object.entries(stats.byLevel).map(([level, count]) => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      value: count,
      color: LogUtils.LOG_LEVELS[level]?.color || '#777'
    }));
  }, [stats.byLevel]);
  
  // Prepare data for time distribution chart
  const hourlyData = useMemo(() => {
    return Object.entries(stats.byHour)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => {
        const hourA = parseInt(a.hour.split(':')[0]);
        const hourB = parseInt(b.hour.split(':')[0]);
        return hourA - hourB;
      });
  }, [stats.byHour]);
  
  // Get percentage of errors
  const errorPercentage = stats.totalLogs > 0 ? 
    ((stats.errorCount / stats.totalLogs) * 100).toFixed(1) : 0;

  // Calculate health indicator (lower is worse)
  const logHealth = useMemo(() => {
    let score = 100;
    
    // Calculate error percentage
    const errorPerc = stats.totalLogs > 0 ? (stats.errorCount / stats.totalLogs) * 100 : 0;
    
    // High error percentage reduces score
    if (errorPerc > 20) score -= 50;
    else if (errorPerc > 10) score -= 30;
    else if (errorPerc > 5) score -= 15;
    
    // Low FPS reduces score
    if (stats.avgFps < 15) score -= 20;
    else if (stats.avgFps < 20) score -= 10;
    
    // Determine status
    let status;
    let color;
    if (score >= 80) {
      status = 'Healthy';
      color = '#4caf50';
    } else if (score >= 60) {
      status = 'Good';
      color = '#2196f3';
    } else if (score >= 40) {
      status = 'Warning';
      color = '#ff9800';
    } else {
      status = 'Critical';
      color = '#f44336';
    }
    
    return { score, status, color };
  }, [stats]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, boxShadow: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="body2" fontWeight="bold">{label}</Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={`item-${index}`} 
              variant="body2" 
              sx={{ color: entry.color || entry.fill }}
            >
              {`${entry.name}: ${entry.value}`}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  // Get icon based on log level
  const getLevelIcon = (level) => {
    switch(level.toLowerCase()) {
      case 'error':
        return <ErrorIcon sx={{ color: LogUtils.LOG_LEVELS.error.color }} />;
      case 'warn':
      case 'warning':
        return <WarningIcon sx={{ color: LogUtils.LOG_LEVELS.warn.color }} />;
      case 'info':
        return <InfoIcon sx={{ color: LogUtils.LOG_LEVELS.info.color }} />;
      default:
        return <InfoIcon sx={{ color: '#777' }} />;
    }
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
        <Assessment sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold">Log Statistics</Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={3}>
        {/* Key Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(145deg, #2196f3 30%, #03a9f4 90%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                right: -20,
                top: -20,
                opacity: 0.2,
                transform: 'rotate(20deg)',
                fontSize: 100
              }}
            >
              <Assessment sx={{ fontSize: 'inherit' }} />
            </Box>
            <CardContent>
              <Typography variant="overline" fontSize={12} component="div">
                Total Logs
              </Typography>
              <Typography variant="h3" component="div" fontWeight="bold">
                {stats.totalLogs}
              </Typography>
              <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                From {stats.byStream.size} Active Streams
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(145deg, #4caf50 30%, #8bc34a 90%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                right: -20,
                top: -20,
                opacity: 0.2,
                transform: 'rotate(20deg)',
                fontSize: 100
              }}
            >
              <Speed sx={{ fontSize: 'inherit' }} />
            </Box>
            <CardContent>
              <Typography variant="overline" fontSize={12} component="div">
                Average FPS
              </Typography>
              <Typography variant="h3" component="div" fontWeight="bold">
                {stats.avgFps.toFixed(1)}
              </Typography>
              <Typography 
                variant="body2" 
                component="div" 
                sx={{ 
                  mt: 1,
                  color: stats.avgFps < 20 ? '#fff176' : 'inherit'
                }}
              >
                {stats.avgFps < 20 ? 'Low Performance' : 'Good Performance'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(145deg, #f44336 30%, #e57373 90%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                right: -20,
                top: -20,
                opacity: 0.2,
                transform: 'rotate(20deg)',
                fontSize: 100
              }}
            >
              <BugReport sx={{ fontSize: 'inherit' }} />
            </Box>
            <CardContent>
              <Typography variant="overline" fontSize={12} component="div">
                Errors
              </Typography>
              <Typography variant="h3" component="div" fontWeight="bold">
                {stats.errorCount}
              </Typography>
              <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                {errorPercentage}% of total logs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card 
            elevation={2} 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(145deg, #673ab7 30%, #9575cd 90%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                right: -20,
                top: -20,
                opacity: 0.2,
                transform: 'rotate(20deg)',
                fontSize: 100
              }}
            >
              <NetworkCheck sx={{ fontSize: 'inherit' }} />
            </Box>
            <CardContent>
              <Typography variant="overline" fontSize={12} component="div">
                WebSocket Events
              </Typography>
              <Typography variant="h3" component="div" fontWeight="bold">
                {stats.websocketEvents}
              </Typography>
              <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                Network Communication Logs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Log Levels Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }} elevation={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Log Levels Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {levelChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Time Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }} elevation={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Log Time Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hourlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Log Count" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Log Level Chips */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }} elevation={2}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">Log Levels</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Object.entries(stats.byLevel).map(([level, count]) => (
                <Chip
                  key={level}
                  icon={getLevelIcon(level)}
                  label={`${level.toUpperCase()}: ${count}`}
                  sx={{
                    backgroundColor: LogUtils.LOG_LEVELS[level]?.color || '#777',
                    color: '#fff',
                    fontWeight: 'bold',
                    py: 2
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LogStats; 