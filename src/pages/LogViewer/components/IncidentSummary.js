import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Badge,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Divider,
  Button,
  Tab,
  Tabs,
  useTheme,
  ToggleButtonGroup
} from '@mui/material';
import {
  Warning,
  SecurityOutlined,
  VerifiedUserOutlined,
  ErrorOutline,
  PhotoCamera,
  Timeline,
  PieChart as PieChartIcon,
  TableChart,
  Image,
  MoreVert,
  NotificationImportant,
  Check,
  Error,
  ArrowUpward,
  Alarm,
  VideoCall as VideoCallIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { LogUtils } from './';

const IncidentSummary = ({ logs }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedChartType, setSelectedChartType] = useState('pie');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Animation configuration for charts
  const ANIMATION_CONFIG = {
    animate: true,
    duration: 800,
    easing: 'ease-in-out'
  };

  // Custom gradient colors for charts with more sophisticated color schemes
  const CHART_COLORS = {
    primary: {
      gradient: ['#3366FF', '#00C6FF'],
      solid: '#3366FF',
      light: 'rgba(51, 102, 255, 0.1)'
    },
    success: {
      gradient: ['#00C48C', '#00F7B5'],
      solid: '#00C48C',
      light: 'rgba(0, 196, 140, 0.1)'
    },
    warning: {
      gradient: ['#FF6B00', '#FFC837'],
      solid: '#FF6B00',
      light: 'rgba(255, 107, 0, 0.1)'
    },
    error: {
      gradient: ['#FF3366', '#FF6B8B'],
      solid: '#FF3366',
      light: 'rgba(255, 51, 102, 0.1)'
    },
    info: {
      gradient: ['#00B8D9', '#00E5FF'],
      solid: '#00B8D9',
      light: 'rgba(0, 184, 217, 0.1)'
    },
    severity: {
      0: { gradient: ['#78909C', '#B0BEC5'], solid: '#78909C' }, // Unknown
      1: { gradient: ['#3366FF', '#00C6FF'], solid: '#3366FF' }, // Low
      2: { gradient: ['#FF6B00', '#FFC837'], solid: '#FF6B00' }, // Medium
      3: { gradient: ['#FF3366', '#FF6B8B'], solid: '#FF3366' }, // High
      4: { gradient: ['#6B2EFF', '#9C6DFF'], solid: '#6B2EFF' }  // Critical
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const incidentData = useMemo(() => {
    const result = {
      total: 0,
      skipped: 0,
      sent: 0,
      successful: 0,
      failed: 0,
      attachments: 0,
      byStream: {},
      byType: {},
      bySeverity: {},
      recentIncidents: [],
      timeDistribution: {},
      hourlyDistribution: {}
    };

    // Temporary storage to track incident flows
    const incidentFlows = {};

    logs.forEach(log => {
      const incident = LogUtils.parseIncidentLog(log.message ? log : { message: log.message || log.__raw });
      if (!incident) return;

      // Track time-based distributions if timestamp is available
      if (incident.timestamp) {
        try {
          const date = new Date(incident.timestamp);
          const dayHour = date.getHours();
          result.hourlyDistribution[dayHour] = (result.hourlyDistribution[dayHour] || 0) + 1;

          // Group by 15-minute intervals for the timeline
          const timeKey = Math.floor(date.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000);
          if (!result.timeDistribution[timeKey]) {
            result.timeDistribution[timeKey] = {
              time: new Date(timeKey).toLocaleTimeString(),
              timestamp: new Date(timeKey).toISOString(),
              count: 0,
              skipped: 0,
              sent: 0
            };
          }
        } catch (err) {
          // Ignore timestamp parsing errors
        }
      }

      if (incident.type === 'skip') {
        result.skipped++;
        
        // Track by stream
        if (!result.byStream[incident.stream]) {
          result.byStream[incident.stream] = { total: 0, skipped: 0, sent: 0 };
        }
        result.byStream[incident.stream].skipped++;
        
        // Track by type
        if (!result.byType[incident.incidentType]) {
          result.byType[incident.incidentType] = { total: 0, skipped: 0, sent: 0 };
        }
        result.byType[incident.incidentType].skipped++;

        // Update time distribution for skipped incidents
        if (incident.timestamp) {
          try {
            const date = new Date(incident.timestamp);
            const timeKey = Math.floor(date.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000);
            if (result.timeDistribution[timeKey]) {
              result.timeDistribution[timeKey].skipped++;
            }
          } catch (err) {
            // Ignore timestamp parsing errors
          }
        }
      }
      
      if (incident.type === 'send') {
        result.total++;
        result.sent++;
        
        // Track by stream
        if (!result.byStream[incident.stream]) {
          result.byStream[incident.stream] = { total: 0, skipped: 0, sent: 0 };
        }
        result.byStream[incident.stream].total++;
        result.byStream[incident.stream].sent++;
        
        // Track by violation type
        const violationType = incident.violation || 'Unknown';
        if (!result.byType[violationType]) {
          result.byType[violationType] = { total: 0, skipped: 0, sent: 0 };
        }
        result.byType[violationType].total++;
        result.byType[violationType].sent++;
        
        // Track by severity
        const severity = incident.severityKey || 0;
        if (!result.bySeverity[severity]) {
          result.bySeverity[severity] = 0;
        }
        result.bySeverity[severity]++;

        // Update time distribution for sent incidents
        if (incident.timestamp) {
          try {
            const date = new Date(incident.timestamp);
            const timeKey = Math.floor(date.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000);
            if (result.timeDistribution[timeKey]) {
              result.timeDistribution[timeKey].sent++;
              result.timeDistribution[timeKey].count++;
            }
          } catch (err) {
            // Ignore timestamp parsing errors
          }
        }
        
        // Store for tracking the flow
        const timestamp = new Date(incident.timestamp).getTime();
        incidentFlows[timestamp] = {
          stream: incident.stream,
          type: incident.violation || 'Unknown',
          severity: incident.severityKey,
          timestamp: incident.timestamp,
          status: 'pending',
          hasAttachment: false,
          attachmentCount: 0
        };
        
        // Add to recent incidents (will be updated if we find more logs about this incident)
        result.recentIncidents.push({
          timestamp: incident.timestamp,
          stream: incident.stream,
          type: incident.violation || 'Unknown',
          severity: incident.severityKey,
          status: 'pending',
          attachmentCount: 0
        });
      }
      
      if (incident.type === 'api_response') {
        // Find the most recent send incident
        const timestamps = Object.keys(incidentFlows).sort((a, b) => b - a);
        for (const ts of timestamps) {
          if (incidentFlows[ts].status === 'pending') {
            incidentFlows[ts].status = incident.status === 200 ? 'success' : 'failed';
            incidentFlows[ts].incidentKey = incident.incidentKey;
            
            // Update recent incidents list
            const recentIncident = result.recentIncidents.find(
              inc => inc.timestamp === incidentFlows[ts].timestamp
            );
            if (recentIncident) {
              recentIncident.status = incident.status === 200 ? 'success' : 'failed';
              recentIncident.incidentKey = incident.incidentKey;
            }
            
            // Update counts
            if (incident.status === 200) {
              result.successful++;
            } else {
              result.failed++;
            }
            
            break;
          }
        }
      }
      
      // Only count successfully uploaded attachments to avoid double-counting
      if (incident.type === 'attachment_response' && incident.status === 200) {
        // Count each attachment ID in the response
        const attachmentCount = Array.isArray(incident.attachmentIds) ? incident.attachmentIds.length : 1;
        result.attachments += attachmentCount;
        
        // Find the incident with this key
        for (const ts in incidentFlows) {
          if (incidentFlows[ts].incidentKey === incident.incidentKey) {
            incidentFlows[ts].hasAttachment = true;
            incidentFlows[ts].attachmentCount += attachmentCount;
            
            // Update recent incidents list
            const recentIncident = result.recentIncidents.find(
              inc => inc.incidentKey === incident.incidentKey
            );
            if (recentIncident) {
              recentIncident.hasAttachment = true;
              recentIncident.attachmentCount += attachmentCount;
            }
            
            break;
          }
        }
      }
    });
    
    // Sort recent incidents by timestamp (newest first) and limit to 10
    result.recentIncidents.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).splice(10);
    
    return result;
  }, [logs]);

  // Format data for charts with fixed severity key
  const chartData = useMemo(() => {
    // Prepare data for pie charts
    const severityData = Object.entries(incidentData.bySeverity).map(([key, value]) => ({
      name: LogUtils.getSeverityLabel(key),
      value,
      color: getSeverityColor(key),
      severity: key // Add the severity key to the data
    }));

    // Convert time distribution to array and sort
    const timeSeriesData = Object.entries(incidentData.timeDistribution)
      .map(([timestamp, data]) => ({
        time: data.time,
        count: data.count,
        sent: data.sent,
        skipped: data.skipped,
        timestamp: data.timestamp
      }))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Prepare hourly distribution data
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      count: incidentData.hourlyDistribution[i] || 0
    }));

    // Prepare stream data
    const streamData = Object.entries(incidentData.byStream).map(([stream, data]) => ({
      name: stream,
      sent: data.sent,
      skipped: data.skipped,
      total: data.total
    }));

    // Prepare violation type data
    const typeData = Object.entries(incidentData.byType)
      .filter(([type, data]) => data.total > 0) // Only include types with incidents
      .map(([type, data]) => ({
        name: type.length > 20 ? type.substring(0, 18) + '...' : type, // Truncate long names
        sent: data.sent,
        skipped: data.skipped,
        total: data.total
      }))
      .sort((a, b) => b.total - a.total); // Sort by total incidents

    return {
      severityData,
      timeSeriesData,
      hourlyData,
      streamData,
      typeData
    };
  }, [incidentData]);

  // Generate colors based on severity with new color scheme
  function getSeverityColor(key) {
    return CHART_COLORS.severity[key]?.solid || CHART_COLORS.severity[0].solid;
  }

  // Enhanced chart rendering with better styling
  const renderChart = () => {
    const commonChartProps = {
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
      animate: ANIMATION_CONFIG.animate,
      animationDuration: ANIMATION_CONFIG.duration,
      animationEasing: ANIMATION_CONFIG.easing
    };

    switch (activeTab) {
      case 0: // Summary / Severity
        if (selectedChartType === 'pie') {
          return (
            <PieChart width={400} height={300} {...commonChartProps}>
              <defs>
                {chartData.severityData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.severity[entry.severity]?.gradient[0] || CHART_COLORS.severity[0].gradient[0]} />
                    <stop offset="95%" stopColor={CHART_COLORS.severity[entry.severity]?.gradient[1] || CHART_COLORS.severity[0].gradient[1]} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={chartData.severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                innerRadius={80}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={(data, index) => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {chartData.severityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${index})`}
                    stroke={entry.color}
                    strokeWidth={hoveredCard === index ? 3 : 1}
                  />
                ))}
              </Pie>
              <RechartsTooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'transparent' }}
              />
              <Legend 
                verticalAlign="bottom" 
                layout="horizontal"
                formatter={(value, entry) => (
                  <span style={{ 
                    color: entry.color, 
                    fontWeight: 'bold',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: `${entry.color}15`
                  }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          );
        } else {
          return (
            <BarChart
              width={500}
              height={300}
              data={chartData.severityData}
              {...commonChartProps}
            >
              <defs>
                {chartData.severityData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`bar-gradient-${index}`} x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={CHART_COLORS.severity[entry.severity]?.gradient[0] || CHART_COLORS.severity[0].gradient[0]} />
                    <stop offset="95%" stopColor={CHART_COLORS.severity[entry.severity]?.gradient[1] || CHART_COLORS.severity[0].gradient[1]} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.divider}
                opacity={0.4}
              />
              <XAxis 
                dataKey="name" 
                tick={{ fill: theme.palette.text.primary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              <YAxis 
                tick={{ fill: theme.palette.text.primary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={{ stroke: theme.palette.divider }}
              />
              <RechartsTooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              />
              <Bar 
                dataKey="value" 
                name="Incidents" 
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              >
                {chartData.severityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#bar-gradient-${index})`}
                    stroke={entry.color}
                    strokeWidth={hoveredCard === index ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          );
        }
      
      case 1: // Time Distribution
        return (
          <LineChart
            width={600}
            height={300}
            data={chartData.timeSeriesData}
            {...commonChartProps}
          >
            <defs>
              <linearGradient id="sent-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.primary.gradient[0]} stopOpacity={0.2}/>
                <stop offset="100%" stopColor={CHART_COLORS.primary.gradient[1]} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="skipped-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.warning.gradient[0]} stopOpacity={0.2}/>
                <stop offset="100%" stopColor={CHART_COLORS.warning.gradient[1]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.palette.divider}
              opacity={0.4}
            />
            <XAxis 
              dataKey="time" 
              tick={{ fill: theme.palette.text.primary }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <YAxis 
              tick={{ fill: theme.palette.text.primary }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <RechartsTooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: theme.palette.divider }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ 
                  color: entry.color, 
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: `${entry.color}15`
                }}>
                  {value}
                </span>
              )}
            />
            <Line 
              type="monotone" 
              dataKey="sent" 
              name="Sent" 
              stroke={CHART_COLORS.primary.solid}
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ 
                r: 6, 
                fill: CHART_COLORS.primary.solid,
                stroke: '#fff',
                strokeWidth: 2
              }}
              fill="url(#sent-area)"
            />
            <Line 
              type="monotone" 
              dataKey="skipped" 
              name="Skipped" 
              stroke={CHART_COLORS.warning.solid}
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ 
                r: 6, 
                fill: CHART_COLORS.warning.solid,
                stroke: '#fff',
                strokeWidth: 2
              }}
              fill="url(#skipped-area)"
            />
          </LineChart>
        );
        
      case 2: // Hourly Distribution
        return (
          <BarChart
            width={600}
            height={300}
            data={chartData.hourlyData}
            {...commonChartProps}
          >
            <defs>
              <linearGradient id="hourly-gradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={CHART_COLORS.info.gradient[0]} />
                <stop offset="100%" stopColor={CHART_COLORS.info.gradient[1]} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.palette.divider}
              opacity={0.4}
            />
            <XAxis 
              dataKey="hour"
              tick={{ fill: theme.palette.text.primary }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <YAxis 
              tick={{ fill: theme.palette.text.primary }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <RechartsTooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            <Bar 
              dataKey="count" 
              name="Incidents" 
              fill="url(#hourly-gradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        );
        
      case 3: // By Stream
        return (
          <BarChart
            width={600}
            height={300}
            data={chartData.streamData}
            {...commonChartProps}
            layout="vertical"
          >
            <defs>
              <linearGradient id="sent-bar" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={CHART_COLORS.primary.gradient[0]} />
                <stop offset="100%" stopColor={CHART_COLORS.primary.gradient[1]} />
              </linearGradient>
              <linearGradient id="skipped-bar" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={CHART_COLORS.warning.gradient[0]} />
                <stop offset="100%" stopColor={CHART_COLORS.warning.gradient[1]} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.palette.divider}
              opacity={0.4}
            />
            <XAxis 
              type="number"
              tick={{ fill: theme.palette.text.primary }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={120}
              tick={{ 
                fill: theme.palette.text.primary,
                fontSize: 12
              }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <RechartsTooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ 
                  color: entry.color, 
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: `${entry.color}15`
                }}>
                  {value}
                </span>
              )}
            />
            <Bar 
              dataKey="sent" 
              name="Sent" 
              stackId="a" 
              fill="url(#sent-bar)"
              radius={[0, 4, 4, 0]}
            />
            <Bar 
              dataKey="skipped" 
              name="Skipped" 
              stackId="a" 
              fill="url(#skipped-bar)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        );
        
      case 4: // By Type
        return (
          <BarChart
            width={600}
            height={300}
            data={chartData.typeData}
            {...commonChartProps}
            layout="vertical"
          >
            <defs>
              <linearGradient id="type-sent" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={CHART_COLORS.success.gradient[0]} />
                <stop offset="100%" stopColor={CHART_COLORS.success.gradient[1]} />
              </linearGradient>
              <linearGradient id="type-skipped" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={CHART_COLORS.error.gradient[0]} />
                <stop offset="100%" stopColor={CHART_COLORS.error.gradient[1]} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.palette.divider}
              opacity={0.4}
            />
            <XAxis 
              type="number"
              tick={{ fill: theme.palette.text.primary }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={150}
              tick={{ 
                fill: theme.palette.text.primary,
                fontSize: 12
              }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <RechartsTooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ 
                  color: entry.color, 
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: `${entry.color}15`
                }}>
                  {value}
                </span>
              )}
            />
            <Bar 
              dataKey="sent" 
              name="Sent" 
              stackId="a" 
              fill="url(#type-sent)"
              radius={[0, 4, 4, 0]}
            />
            <Bar 
              dataKey="skipped" 
              name="Skipped" 
              stackId="a" 
              fill="url(#type-skipped)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        );
        
      default:
        return null;
    }
  };

  // Enhanced tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper 
          sx={{ 
            p: 2,
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: theme.shadows[4]
          }}
        >
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box 
              key={`item-${index}`} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1,
                mb: 0.5
              }}
            >
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  backgroundColor: entry.color || entry.fill,
                  borderRadius: '50%',
                  boxShadow: `0 0 8px ${entry.color || entry.fill}`
                }} 
              />
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {entry.name}: <strong>{entry.value}</strong>
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  // Enhanced card styling with fixed color usage
  const StyledCard = ({ children, color, icon: Icon, title, value, trend }) => (
    <Card 
      elevation={hoveredCard === title ? 8 : 4} 
      onMouseEnter={() => setHoveredCard(title)}
      onMouseLeave={() => setHoveredCard(null)}
      sx={{ 
        borderRadius: 3,
        background: `linear-gradient(135deg, ${color.gradient[0]} 0%, ${color.gradient[1]} 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        transform: hoveredCard === title ? 'translateY(-4px)' : 'none'
      }}
    >
      <Box sx={{ 
        position: 'absolute',
        right: -20,
        top: -20,
        opacity: 0.1,
        transform: 'rotate(20deg)',
        fontSize: 120
      }}>
        <Icon sx={{ fontSize: 'inherit' }} />
      </Box>
      <CardContent>
        <Typography variant="overline" fontSize={12} component="div" sx={{ opacity: 0.8 }}>
          {title}
        </Typography>
        <Typography variant="h3" component="div" fontWeight="bold" sx={{ my: 1 }}>
          {value}
        </Typography>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {trend.icon}
            <Typography variant="body2" component="div" sx={{ opacity: 0.9 }}>
              {trend.text}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (incidentData.total === 0 && incidentData.skipped === 0) return null;

  // Calculate health status based on success rate
  const calculateHealthStatus = () => {
    const totalAttempted = incidentData.successful + incidentData.failed;
    if (totalAttempted === 0) return { status: 'No Data', color: '#9e9e9e' };
    
    const successRate = (incidentData.successful / totalAttempted) * 100;
    
    if (successRate >= 95) return { status: 'Excellent', color: '#4caf50' };
    if (successRate >= 80) return { status: 'Good', color: '#8bc34a' };
    if (successRate >= 60) return { status: 'Fair', color: '#ff9800' };
    return { status: 'Poor', color: '#f44336' };
  };

  const healthStatus = calculateHealthStatus();

  return (
    <Paper sx={{ 
      p: 3, 
      mb: 2, 
      borderRadius: 3, 
      boxShadow: theme.shadows[4],
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(to right bottom, #1a237e, #000000)'
        : 'linear-gradient(to right bottom, #e3f2fd, #ffffff)',
      backdropFilter: 'blur(20px)'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: theme.palette.primary.main,
            width: 48,
            height: 48,
            boxShadow: theme.shadows[3]
          }}>
            <VerifiedUserOutlined sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
              Safety Incident Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last updated: {new Date().toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Timeline />}
            onClick={() => setSelectedTimeRange('24h')}
            color={selectedTimeRange === '24h' ? 'primary' : 'inherit'}
          >
            24H
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Timeline />}
            onClick={() => setSelectedTimeRange('7d')}
            color={selectedTimeRange === '7d' ? 'primary' : 'inherit'}
          >
            7D
          </Button>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StyledCard
            color={CHART_COLORS.primary}
            icon={VerifiedUserOutlined}
            title="Total Incidents"
            value={incidentData.total}
            trend={{
              icon: <ArrowUpward sx={{ fontSize: 14 }} />,
              text: `${incidentData.skipped} skipped due to cooldown`
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StyledCard
            color={CHART_COLORS.warning}
            icon={Warning}
            title="Skipped (Cooldown)"
            value={incidentData.skipped}
            trend={{
              icon: <Alarm sx={{ fontSize: 14 }} />,
              text: `${((incidentData.skipped / (incidentData.total + incidentData.skipped)) * 100).toFixed(1)}% prevention rate`
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StyledCard
            color={CHART_COLORS.success}
            icon={Check}
            title="Successfully Reported"
            value={incidentData.successful}
            trend={{
              icon: <Check sx={{ fontSize: 14 }} />,
              text: `${((incidentData.successful / (incidentData.successful + incidentData.failed)) * 100).toFixed(1)}% success rate`
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StyledCard
            color={CHART_COLORS.info}
            icon={Image}
            title="Attachments Uploaded"
            value={incidentData.attachments}
            trend={{
              icon: <PhotoCamera sx={{ fontSize: 14 }} />,
              text: `${((incidentData.attachments / incidentData.total) * 100).toFixed(1)}% with evidence`
            }}
          />
        </Grid>
        
        {/* Charts Section */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              borderRadius: 2,
              boxShadow: 3,
              mb: 2
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                aria-label="chart tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab icon={<PieChartIcon />} label="By Severity" />
                <Tab icon={<Timeline />} label="Time Trend" />
                <Tab icon={<Alarm />} label="Hourly Distribution" />
                <Tab icon={<VideoCallIcon sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.info.main }} />} label="By Stream" />
                <Tab icon={<NotificationImportant />} label="By Violation Type" />
              </Tabs>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: 320
            }}>
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Breakdown by Type */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              <NotificationImportant sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.warning.main }} />
              By Violation Type
            </Typography>
            <Paper variant="outlined" sx={{ p: 1.5, maxHeight: 200, overflow: 'auto' }}>
              <List dense disablePadding>
                {Object.entries(incidentData.byType).map(([type, data]) => (
                  <ListItem key={type} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={
                        <Typography variant="body2" noWrap>
                          {type}
                        </Typography>
                      }
                      secondary={`Total: ${data.total} | Sent: ${data.sent} | Skipped: ${data.skipped}`}
                    />
                    <Box sx={{ width: 120 }}>
                      <LinearProgress 
                        variant="determinate"
                        value={(data.sent / (data.sent + data.skipped)) * 100}
                        sx={{ 
                          height: 8, 
                          borderRadius: 5,
                          mr: 1
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {((data.sent / (data.sent + data.skipped)) * 100).toFixed(0)}% sent
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Paper>
        </Grid>
        
        {/* Breakdown by Stream */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              <VideoCallIcon sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.info.main }} />
              By Stream
            </Typography>
            <Paper variant="outlined" sx={{ p: 1.5, maxHeight: 200, overflow: 'auto' }}>
              <List dense disablePadding>
                {Object.entries(incidentData.byStream).map(([stream, data]) => (
                  <ListItem key={stream} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={
                        <Typography variant="body2" noWrap>
                          {stream}
                        </Typography>
                      }
                      secondary={`Total: ${data.total} | Sent: ${data.sent} | Skipped: ${data.skipped}`}
                    />
                    <Box sx={{ width: 120 }}>
                      <LinearProgress 
                        variant="determinate"
                        value={(data.sent / (data.total + data.skipped)) * 100}
                        sx={{ 
                          height: 8, 
                          borderRadius: 5,
                          mr: 1
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {((data.sent / (data.total + data.skipped)) * 100).toFixed(0)}% sent
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Paper>
        </Grid>
        
        {/* Breakdown by Severity */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              <Error sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.error.main }} />
              By Severity
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2, mt: 1 }}>
              {Object.entries(incidentData.bySeverity).map(([severity, count]) => {
                // Define colors based on severity
                const colors = {
                  1: { bg: '#e3f2fd', color: '#2196f3' }, // Low - Blue
                  2: { bg: '#fff8e1', color: '#ffc107' }, // Medium - Yellow
                  3: { bg: '#fff5f5', color: '#f44336' }, // High - Red
                  4: { bg: '#4a148c', color: '#ffffff' }  // Critical - Purple
                };
                const style = colors[severity] || { bg: '#f5f5f5', color: '#757575' };
                
                return (
                  <Paper 
                    key={severity}
                    elevation={3}
                    sx={{ 
                      p: 1.5, 
                      bgcolor: style.bg, 
                      color: style.color,
                      borderRadius: 2,
                      minWidth: 100,
                      textAlign: 'center',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold">{count}</Typography>
                    <Typography variant="body2">{LogUtils.getSeverityLabel(severity)}</Typography>
                  </Paper>
                );
              })}
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Incidents Timeline */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              <Timeline sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.primary.main }} />
              Recent Incidents
            </Typography>
            <Paper variant="outlined" sx={{ p: 1, maxHeight: 300, overflow: 'auto', borderRadius: 2 }}>
              <List dense>
                {incidentData.recentIncidents.map((incident, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      borderLeft: `4px solid ${getSeverityColor(incident.severity)}`,
                      mb: 1,
                      borderRadius: '4px',
                      backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.03)' : 'transparent'
                    }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {incident.hasAttachment && (
                          <Tooltip title="Has image attachment">
                            <Badge badgeContent={incident.attachmentCount} color="primary">
                              <PhotoCamera fontSize="small" color="primary" />
                            </Badge>
                          </Tooltip>
                        )}
                        <Chip 
                          label={incident.status === 'success' ? 'Success' : 
                                incident.status === 'failed' ? 'Failed' : 'Pending'}
                          size="small"
                          color={incident.status === 'success' ? 'success' : 
                                incident.status === 'failed' ? 'error' : 'warning'}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" noWrap fontWeight="medium">
                          <strong>{incident.type}</strong> on <em>{incident.stream}</em>
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" display="block" color="text.secondary">
                          {new Date(incident.timestamp).toLocaleTimeString()} | 
                          Severity: {LogUtils.getSeverityLabel(incident.severity)}
                          {incident.incidentKey && ` | ID: ${incident.incidentKey}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default IncidentSummary; 