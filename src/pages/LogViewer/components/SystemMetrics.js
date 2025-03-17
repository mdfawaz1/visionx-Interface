import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress, 
  LinearProgress,
  Tabs,
  Tab,
  Divider,
  useTheme
} from '@mui/material';
import { Memory, Storage, Speed, NetworkCheck, Warning, CheckCircle } from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  Brush
} from 'recharts';

const SystemMetrics = ({ systemMetrics, metricsLoading }) => {
  const theme = useTheme();
  const [metricsHistory, setMetricsHistory] = useState({
    cpu: [],
    memory: [],
    disk: [],
    network: []
  });
  const [selectedTab, setSelectedTab] = useState(0);

  // Store metrics history for charts
  useEffect(() => {
    if (!metricsLoading && systemMetrics) {
      const timestamp = new Date().toLocaleTimeString();
      
      setMetricsHistory(prev => {
        // Keep only the last 20 data points to avoid overcrowding
        const cpuData = [...prev.cpu, { 
          timestamp, 
          usage: systemMetrics.cpu?.usage || 0,
          temperature: systemMetrics.cpu?.temperature || 0
        }].slice(-20);
        
        const memoryData = [...prev.memory, {
          timestamp,
          used: systemMetrics.memory?.used ? (systemMetrics.memory.used / 1024 / 1024 / 1024) : 0,
          free: systemMetrics.memory?.free ? (systemMetrics.memory.free / 1024 / 1024 / 1024) : 0,
          total: systemMetrics.memory?.total ? (systemMetrics.memory.total / 1024 / 1024 / 1024) : 0,
          usedPercentage: systemMetrics.memory?.total ? 
            (systemMetrics.memory.used / systemMetrics.memory.total) * 100 : 0
        }].slice(-20);
        
        const diskData = [...prev.disk, {
          timestamp,
          used: systemMetrics.disk?.used ? (systemMetrics.disk.used / 1024 / 1024 / 1024) : 0,
          free: systemMetrics.disk?.free ? (systemMetrics.disk.free / 1024 / 1024 / 1024) : 0,
          total: systemMetrics.disk?.total ? (systemMetrics.disk.total / 1024 / 1024 / 1024) : 0,
          usedPercentage: systemMetrics.disk?.total ? 
            (systemMetrics.disk.used / systemMetrics.disk.total) * 100 : 0
        }].slice(-20);
        
        const networkData = [...prev.network, {
          timestamp,
          received: systemMetrics.network?.bytesReceived ? 
            (systemMetrics.network.bytesReceived / 1024 / 1024) : 0,
          sent: systemMetrics.network?.bytesSent ? 
            (systemMetrics.network.bytesSent / 1024 / 1024) : 0
        }].slice(-20);
        
        return {
          cpu: cpuData,
          memory: memoryData,
          disk: diskData,
          network: networkData
        };
      });
    }
  }, [systemMetrics, metricsLoading]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Calculate system health score
  const calculateHealthScore = () => {
    if (!systemMetrics) return { score: 0, status: 'Unknown' };
    
    let score = 100;
    
    // Deduct points for high CPU usage
    if (systemMetrics.cpu?.usage > 90) score -= 30;
    else if (systemMetrics.cpu?.usage > 70) score -= 15;
    else if (systemMetrics.cpu?.usage > 50) score -= 5;
    
    // Deduct points for high memory usage
    const memoryUsage = systemMetrics.memory?.total ? 
      (systemMetrics.memory.used / systemMetrics.memory.total) * 100 : 0;
    if (memoryUsage > 90) score -= 30;
    else if (memoryUsage > 70) score -= 15;
    else if (memoryUsage > 50) score -= 5;
    
    // Deduct points for high disk usage
    const diskUsage = systemMetrics.disk?.total ? 
      (systemMetrics.disk.used / systemMetrics.disk.total) * 100 : 0;
    if (diskUsage > 90) score -= 20;
    else if (diskUsage > 70) score -= 10;
    
    // Determine status based on score
    let status;
    if (score >= 80) status = 'Healthy';
    else if (score >= 60) status = 'Good';
    else if (score >= 40) status = 'Warning';
    else status = 'Critical';
    
    return { score, status };
  };

  const healthScore = calculateHealthScore();

  // Data for pie charts
  const memoryPieData = [
    { name: 'Used', value: systemMetrics?.memory?.used ? 
      (systemMetrics.memory.used / 1024 / 1024 / 1024) : 0, color: '#f44336' },
    { name: 'Free', value: systemMetrics?.memory?.free ? 
      (systemMetrics.memory.free / 1024 / 1024 / 1024) : 0, color: '#4caf50' }
  ];
  
  const diskPieData = [
    { name: 'Used', value: systemMetrics?.disk?.used ? 
      (systemMetrics.disk.used / 1024 / 1024 / 1024) : 0, color: '#ff9800' },
    { name: 'Free', value: systemMetrics?.disk?.free ? 
      (systemMetrics.disk.free / 1024 / 1024 / 1024) : 0, color: '#2196f3' }
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, boxShadow: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="body2">{`Time: ${label}`}</Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={`item-${index}`} 
              variant="body2" 
              sx={{ color: entry.color || entry.stroke }}
            >
              {`${entry.name}: ${entry.value.toFixed(2)}${entry.unit || ''}`}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Speed sx={{ fontSize: 28, color: theme.palette.primary.main, mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">System Metrics</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {metricsLoading ? (
            <CircularProgress size={24} sx={{ mr: 2 }} />
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              bgcolor: healthScore.status === 'Healthy' ? 'success.light' : 
                      healthScore.status === 'Good' ? 'info.light' :
                      healthScore.status === 'Warning' ? 'warning.light' : 'error.light',
              px: 2,
              py: 0.5,
              borderRadius: 10,
              mr: 2
            }}>
              {healthScore.status === 'Healthy' || healthScore.status === 'Good' ? 
                <CheckCircle sx={{ mr: 1, fontSize: 16 }} /> : 
                <Warning sx={{ mr: 1, fontSize: 16 }} />
              }
              <Typography 
                variant="body2" 
                fontWeight="bold"
              >
                System Health: {healthScore.score}% ({healthScore.status})
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={3}>
        {/* CPU Usage Gauge */}
        <Grid item xs={12} md={3}>
          <Box sx={{ textAlign: 'center', position: 'relative' }}>
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={120}
                  thickness={4}
                  sx={{ color: theme.palette.grey[300] }}
                />
                <CircularProgress
                  variant="determinate"
                  value={systemMetrics?.cpu?.usage || 0}
                  size={120}
                  thickness={4}
                  sx={{
                    color: (systemMetrics?.cpu?.usage || 0) > 80 ? 'error.main' :
                           (systemMetrics?.cpu?.usage || 0) > 60 ? 'warning.main' : 'success.main',
                    position: 'absolute',
                    left: 0,
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h5"
                    component="div"
                    color="text.primary"
                    fontWeight="bold"
                  >
                    {Math.round(systemMetrics?.cpu?.usage || 0)}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>CPU Usage</Typography>
              <Typography variant="caption">
                Temp: {systemMetrics?.cpu?.temperature || 'N/A'}°C
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Memory Pie Chart */}
        <Grid item xs={12} md={3}>
          <Box sx={{ height: 150, textAlign: 'center' }}>
            <Typography variant="subtitle1">Memory Usage</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={memoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {memoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <Typography variant="caption">
              {systemMetrics?.memory?.used ? 
                (systemMetrics.memory.used / 1024 / 1024 / 1024).toFixed(2) : '0'} GB / 
              {systemMetrics?.memory?.total ? 
                (systemMetrics.memory.total / 1024 / 1024 / 1024).toFixed(2) : '0'} GB
            </Typography>
          </Box>
        </Grid>

        {/* Disk Pie Chart */}
        <Grid item xs={12} md={3}>
          <Box sx={{ height: 150, textAlign: 'center' }}>
            <Typography variant="subtitle1">Disk Usage</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {diskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <Typography variant="caption">
              {systemMetrics?.disk?.used ? 
                (systemMetrics.disk.used / 1024 / 1024 / 1024).toFixed(2) : '0'} GB / 
              {systemMetrics?.disk?.total ? 
                (systemMetrics.disk.total / 1024 / 1024 / 1024).toFixed(2) : '0'} GB
            </Typography>
          </Box>
        </Grid>

        {/* Network Stats */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NetworkCheck sx={{ mr: 1, color: '#2196f3' }} />
              <Typography variant="subtitle1">Network Traffic</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" display="block" color="text.secondary">
                Received (MB)
              </Typography>
              <Typography variant="h6" fontWeight="medium" color="#2196f3">
                {systemMetrics?.network?.bytesReceived ? 
                  (systemMetrics.network.bytesReceived / 1024 / 1024).toFixed(2) : '0'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" display="block" color="text.secondary">
                Sent (MB)
              </Typography>
              <Typography variant="h6" fontWeight="medium" color="#f44336">
                {systemMetrics?.network?.bytesSent ? 
                  (systemMetrics.network.bytesSent / 1024 / 1024).toFixed(2) : '0'}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Tabs for detailed charts */}
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={selectedTab} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab icon={<Speed />} label="CPU" />
              <Tab icon={<Memory />} label="Memory" />
              <Tab icon={<Storage />} label="Disk" />
              <Tab icon={<NetworkCheck />} label="Network" />
            </Tabs>
          </Box>

          {/* CPU Chart */}
          <Box hidden={selectedTab !== 0} sx={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricsHistory.cpu} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="timestamp" stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
                <YAxis stroke={theme.palette.text.secondary} domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Brush dataKey="timestamp" height={30} stroke="#8884d8" />
                <Line type="monotone" dataKey="usage" name="CPU Usage" stroke="#f44336" dot={false} unit="%" strokeWidth={2} animationDuration={500} fill="url(#colorCpu)" />
                <Line type="monotone" dataKey="temperature" name="Temperature" stroke="#ff9800" dot={false} unit="°C" strokeWidth={2} animationDuration={500} />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          {/* Memory Chart */}
          <Box hidden={selectedTab !== 1} sx={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metricsHistory.memory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="timestamp"
                  stroke={theme.palette.text.secondary}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke={theme.palette.text.secondary}
                  tick={{ fontSize: 12 }}
                  unit=" GB"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="used" 
                  name="Used Memory" 
                  stackId="1"
                  stroke="#f44336" 
                  fill="#f44336"
                  fillOpacity={0.6}
                  unit=" GB"
                />
                <Area 
                  type="monotone" 
                  dataKey="free" 
                  name="Free Memory" 
                  stackId="1"
                  stroke="#4caf50" 
                  fill="#4caf50"
                  fillOpacity={0.6}
                  unit=" GB"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>

          {/* Disk Chart */}
          <Box hidden={selectedTab !== 2} sx={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metricsHistory.disk} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="timestamp"
                  stroke={theme.palette.text.secondary}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke={theme.palette.text.secondary}
                  tick={{ fontSize: 12 }}
                  unit=" GB"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="used" 
                  name="Used Disk" 
                  stackId="1"
                  stroke="#ff9800" 
                  fill="#ff9800"
                  fillOpacity={0.6}
                  unit=" GB"
                />
                <Area 
                  type="monotone" 
                  dataKey="free" 
                  name="Free Disk" 
                  stackId="1"
                  stroke="#2196f3" 
                  fill="#2196f3"
                  fillOpacity={0.6}
                  unit=" GB"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>

          {/* Network Chart */}
          <Box hidden={selectedTab !== 3} sx={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricsHistory.network} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="timestamp"
                  stroke={theme.palette.text.secondary}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke={theme.palette.text.secondary}
                  tick={{ fontSize: 12 }}
                  unit=" MB"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="received" 
                  name="Received" 
                  stroke="#2196f3" 
                  dot={false}
                  strokeWidth={2}
                  unit=" MB"
                />
                <Line 
                  type="monotone" 
                  dataKey="sent" 
                  name="Sent" 
                  stroke="#f44336" 
                  dot={false}
                  strokeWidth={2}
                  unit=" MB"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SystemMetrics; 