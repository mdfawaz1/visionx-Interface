import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  Slider,
  FormControlLabel,
  Paper,
  Divider,
  Tooltip,
  IconButton,
  Chip,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  styled,
  RadioGroup,
  Radio,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  DatasetOutlined,
  ModelTraining,
  TrendingUp,
  CompareArrows,
  ErrorOutline,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import api from '../../api';
import { alpha, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledCard = styled(motion.div)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.1)}`,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontWeight: 700,
}));

const StyledStep = styled(Step)(({ theme }) => ({
  '& .MuiStepLabel-root': {
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
  },
  '& .MuiStepContent-root': {
    borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(4),
  },
}));

const ModelCard = styled(motion.div)(({ theme, selected }) => ({
  cursor: 'pointer',
  height: '100%',
  background: selected 
    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.2)})`
    : theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid rgba(0, 0, 0, 0.12)',
  boxShadow: selected 
    ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`
    : '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: selected ? 'none' : 'translateY(-4px)',
    boxShadow: selected 
      ? `0 12px 40px ${alpha(theme.palette.primary.main, 0.25)}`
      : '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

const DataSourceCard = styled(motion.div)(({ theme, selected }) => ({
  cursor: 'pointer',
  padding: theme.spacing(3),
  background: selected 
    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.2)})`
    : theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid rgba(0, 0, 0, 0.12)',
  boxShadow: selected 
    ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`
    : '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: selected ? 'none' : 'translateY(-4px)',
    boxShadow: selected 
      ? `0 12px 40px ${alpha(theme.palette.primary.main, 0.25)}`
      : '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '&.MuiChip-filled': {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    color: theme.palette.primary.contrastText,
    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

const GlassCard = styled(motion.div)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 3,
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

const GradientBorder = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: 2,
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  '&:after': {
    content: '""',
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: theme.shape.borderRadius * 2 - 1,
    background: theme.palette.background.paper,
  },
}));

const FloatingCard = styled(motion.div)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 50%)`,
  '&:after': {
    content: '""',
    position: 'absolute',
    top: '20%',
    left: '30%',
    width: '40%',
    height: '40%',
    background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.secondary.light, 0.1)} 0%, transparent 50%)`,
    animation: 'float 10s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translate(0, 0)',
    },
    '50%': {
      transform: 'translate(5%, 5%)',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: '10px 24px',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.5)}`,
  },
}));

const Forecasting = () => {
  const theme = useTheme();
  const [selectedDataSource, setSelectedDataSource] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [forecastPeriod, setForecastPeriod] = useState(30);
  const [dataSources, setDataSources] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [modelConfig, setModelConfig] = useState({});
  const [defaultConfigs, setDefaultConfigs] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // Add preset configurations
  const presetConfigs = {
    prophet: {
      fast: {
        yearly_seasonality: false,
        weekly_seasonality: true,
        daily_seasonality: false,
        changepoint_prior_scale: 0.01,
        seasonality_prior_scale: 5,
        holidays_prior_scale: 5,
        changepoint_range: 0.8,
        n_changepoints: 15,
        seasonality_mode: 'additive',
        growth: 'linear'
      },
      balanced: {
        yearly_seasonality: true,
        weekly_seasonality: true,
        daily_seasonality: true,
        changepoint_prior_scale: 0.05,
        seasonality_prior_scale: 10,
        holidays_prior_scale: 10,
        changepoint_range: 0.8,
        n_changepoints: 25,
        seasonality_mode: 'additive',
        growth: 'linear'
      },
      accurate: {
        yearly_seasonality: true,
        weekly_seasonality: true,
        daily_seasonality: true,
        changepoint_prior_scale: 0.1,
        seasonality_prior_scale: 15,
        holidays_prior_scale: 15,
        changepoint_range: 0.9,
        n_changepoints: 35,
        seasonality_mode: 'multiplicative',
        growth: 'logistic'
      }
    },
    arima: {
      fast: {
        order_p: 1,
        order_d: 1,
        order_q: 1,
        seasonal_order_P: 0,
        seasonal_order_D: 0,
        seasonal_order_Q: 0,
        seasonal_periods: 1,
        trend: 'c'
      },
      balanced: {
        order_p: 2,
        order_d: 1,
        order_q: 2,
        seasonal_order_P: 1,
        seasonal_order_D: 1,
        seasonal_order_Q: 1,
        seasonal_periods: 12,
        trend: 'ct'
      },
      accurate: {
        order_p: 3,
        order_d: 2,
        order_q: 3,
        seasonal_order_P: 2,
        seasonal_order_D: 1,
        seasonal_order_Q: 2,
        seasonal_periods: 12,
        trend: 'ct'
      }
    },
    lstm: {
      fast: {
        epochs: 25,
        batch_size: 64,
        sequence_length: 10,
        neurons: 32,
        dropout_rate: 0.1,
        learning_rate: 0.01,
        validation_split: 0.1,
        optimizer: 'adam',
        layers: 1
      },
      balanced: {
        epochs: 50,
        batch_size: 32,
        sequence_length: 20,
        neurons: 50,
        dropout_rate: 0.2,
        learning_rate: 0.001,
        validation_split: 0.2,
        optimizer: 'adam',
        layers: 2
      },
      accurate: {
        epochs: 100,
        batch_size: 16,
        sequence_length: 30,
        neurons: 100,
        dropout_rate: 0.3,
        learning_rate: 0.0001,
        validation_split: 0.3,
        optimizer: 'adam',
        layers: 3
      }
    },
    nhits: {
      fast: {
        input_size: 20,
        n_pools: 2,
        n_freq: 2,
        num_stacks: 2,
        num_blocks: 1,
        num_layers: 1,
        layer_widths: 256,
        epochs: 25,
        batch_size: 64,
        learning_rate: 0.001
      },
      balanced: {
        input_size: 30,
        n_pools: 3,
        n_freq: 3,
        num_stacks: 3,
        num_blocks: 1,
        num_layers: 2,
        layer_widths: 512,
        epochs: 50,
        batch_size: 32,
        learning_rate: 0.0001
      },
      accurate: {
        input_size: 40,
        n_pools: 4,
        n_freq: 4,
        num_stacks: 4,
        num_blocks: 2,
        num_layers: 3,
        layer_widths: 1024,
        epochs: 100,
        batch_size: 16,
        learning_rate: 0.00001
      }
    }
  };

  // Fetch data sources and models on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [dataSourcesRes, modelsRes] = await Promise.all([
          api.get('/forecasting/data-sources'),
          api.get('/forecasting/models')
        ]);

        setDataSources(dataSourcesRes.data.dataSources);
        setAvailableModels(modelsRes.data.models);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to load data sources and models');
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await api.get('/forecasting/model-configs');
        setDefaultConfigs(response.data.configs);
        setModelConfig(response.data.configs);
      } catch (error) {
        console.error('Error fetching configs:', error);
      }
    };
    fetchConfigs();
  }, []);

  const handleTrainModel = async () => {
    setLoading(true);
    setError(null);
    setForecast(null);

    try {
      const response = await api.post('/forecasting/train', {
        dataSource: selectedDataSource,
        fields: selectedFields,
        model: selectedModel,
        forecastPeriod: forecastPeriod,
      });

      if (response.data.success) {
        setForecast(response.data.forecast);
      } else {
        setError(response.data.error || 'Failed to generate forecast');
      }
    } catch (error) {
      console.error('Error training model:', error);
      setError(error.response?.data?.error || 'Failed to train model');
    } finally {
      setLoading(false);
    }
  };

  // Add handlePresetChange function
  const handlePresetChange = (modelId, preset) => {
    if (!presetConfigs[modelId] || !presetConfigs[modelId][preset]) {
      console.error(`Invalid preset configuration for model ${modelId} and preset ${preset}`);
      return;
    }

    setModelConfig(prev => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        ...presetConfigs[modelId][preset],
        preset: preset
      }
    }));
  };

  // Get available fields for selected data source
  const getAvailableFields = () => {
    const selectedSource = dataSources.find(source => source.id === selectedDataSource);
    return selectedSource ? selectedSource.fields.filter(field => field !== 'ds') : [];
  };

  const handleConfigChange = (model, param, value) => {
    setModelConfig(prev => ({
      ...prev,
      [model]: {
        ...prev[model],
        [param]: value
      }
    }));
  };

  const handleDownloadResults = () => {
    if (!forecast) return;
    
    const csvContent = [
      ['Date', 'Actual', 'Forecast', 'Lower Bound', 'Upper Bound'].join(','),
      ...forecast.dates.map((date, i) => [
        date,
        i < forecast.actual.length ? forecast.actual[i] : '',
        forecast.forecast[i],
        forecast.lower_bound?.[i] || '',
        forecast.upper_bound?.[i] || '',
      ].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast_${selectedDataSource}_${selectedModel}_${new Date().toISOString()}.csv`;
    a.click();
  };

  const renderModelInfo = () => {
    const modelInfo = {
      prophet: {
        title: 'Facebook Prophet',
        description: 'Best for data with strong seasonal patterns and multiple seasonality periods.',
        strengths: ['Handles missing data well', 'Automatic seasonality detection', 'Robust to outliers'],
      },
      arima: {
        title: 'ARIMA',
        description: 'Suitable for stationary time series or data that can be made stationary.',
        strengths: ['Good for short-term forecasting', 'Works well with regular patterns', 'Statistical confidence intervals'],
      },
      lstm: {
        title: 'LSTM Neural Network',
        description: 'Powerful for complex patterns and long-term dependencies.',
        strengths: ['Captures complex patterns', 'Learns long-term dependencies', 'Handles multivariate data'],
      },
    };

    if (!selectedModel || !modelInfo[selectedModel]) return null;

    const info = modelInfo[selectedModel];

    return (
      <Paper sx={{ p: 2, mb: 3, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <TimelineIcon color="primary" />
          <Typography variant="h6">{info.title}</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {info.description}
        </Typography>
        <Stack direction="row" spacing={1}>
          {info.strengths.map((strength, index) => (
            <Chip
              key={index}
              label={strength}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>
      </Paper>
    );
  };

  const renderForecastChart = () => {
    if (!forecast) return null;

    const data = forecast.dates.map((date, i) => ({
      date,
      forecast: forecast.forecast[i],
      actual: i < forecast.actual.length ? forecast.actual[i] : null,
      lower: forecast.lower_bound?.[i],
      upper: forecast.upper_bound?.[i],
    }));

    return (
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Forecast Results
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Download Results">
              <IconButton
                sx={{
                  background: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
                onClick={handleDownloadResults}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={handleTrainModel} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis />
              <RechartsTooltip
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
              />
              <Legend />
              {forecast.lower_bound && forecast.upper_bound && (
                <Area
                  dataKey="upper"
                  stroke="none"
                  fill="#82ca9d"
                  fillOpacity={0.1}
                />
              )}
              {forecast.lower_bound && forecast.upper_bound && (
                <Area
                  dataKey="lower"
                  stroke="none"
                  fill="#82ca9d"
                  fillOpacity={0.1}
                />
              )}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                name="Actual"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
                name="Forecast"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    );
  };

  const renderConfigAccordion = () => {
    if (!selectedModel || !modelConfig[selectedModel]) return null;

    return (
      <Accordion
        sx={{
          mb: 3,
          '&.MuiAccordion-root': {
            borderRadius: 1,
            '&:before': {
              display: 'none',
            },
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <SettingsIcon color="primary" />
            <Typography>Model Configuration</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {Object.entries(modelConfig[selectedModel]).map(([param, value]) => (
              <Grid item xs={12} md={6} key={param}>
                <Paper sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <Typography variant="subtitle2">
                      {param.replace(/_/g, ' ')}
                    </Typography>
                    <Tooltip title={getParameterDescription(param)}>
                      <InfoIcon fontSize="small" color="action" />
                    </Tooltip>
                  </Stack>
                  {typeof value === 'boolean' ? (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={value}
                          onChange={(e) =>
                            handleConfigChange(selectedModel, param, e.target.checked)
                          }
                        />
                      }
                      label={value ? 'Enabled' : 'Disabled'}
                    />
                  ) : (
                    <Slider
                      value={value}
                      onChange={(e, newValue) =>
                        handleConfigChange(selectedModel, param, newValue)
                      }
                      min={getParameterRange(param).min}
                      max={getParameterRange(param).max}
                      step={getParameterRange(param).step}
                      valueLabelDisplay="auto"
                      marks
                    />
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderDataSourceSelection = () => (
    <Grid container spacing={3}>
      {dataSources.map((source) => (
        <Grid item xs={12} md={4} key={source.id}>
          <DataSourceCard
            selected={selectedDataSource === source.id}
            onClick={() => setSelectedDataSource(source.id)}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <DatasetOutlined color={selectedDataSource === source.id ? 'primary' : 'action'} />
                <Typography variant="h6">{source.name}</Typography>
              </Stack>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Available Fields:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {source.fields.map((field) => (
                    <Chip
                      key={field}
                      label={field}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newFields = selectedFields.includes(field)
                          ? selectedFields.filter(f => f !== field)
                          : [...selectedFields, field];
                        setSelectedFields(newFields);
                      }}
                      color={selectedFields.includes(field) ? 'primary' : 'default'}
                      variant={selectedFields.includes(field) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </DataSourceCard>
        </Grid>
      ))}
    </Grid>
  );

  const renderModelSelection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Grid container spacing={3}>
        {availableModels.map((model, index) => (
          <Grid item xs={12} md={4} key={model.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ModelCard
                selected={selectedModel === model.id}
                onClick={() => {
                  setSelectedModel(model.id);
                  // Initialize with balanced preset if not already set
                  if (!modelConfig[model.id]?.preset) {
                    handlePresetChange(model.id, 'balanced');
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Box p={3}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ModelTraining color={selectedModel === model.id ? 'primary' : 'action'} />
                      <Typography variant="h6">{model.name}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {model.description}
                    </Typography>
                    {selectedModel === model.id && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          Quick Settings:
                        </Typography>
                        <RadioGroup
                          row
                          value={modelConfig[model.id]?.preset || 'balanced'}
                          onChange={(e) => handlePresetChange(model.id, e.target.value)}
                        >
                          <FormControlLabel 
                            value="fast" 
                            control={<Radio />} 
                            label={
                              <Tooltip title="Faster training, lower accuracy">
                                <span>Fast</span>
                              </Tooltip>
                            }
                          />
                          <FormControlLabel 
                            value="balanced" 
                            control={<Radio />} 
                            label={
                              <Tooltip title="Balanced between speed and accuracy">
                                <span>Balanced</span>
                              </Tooltip>
                            }
                          />
                          <FormControlLabel 
                            value="accurate" 
                            control={<Radio />} 
                            label={
                              <Tooltip title="Higher accuracy, slower training">
                                <span>Accurate</span>
                              </Tooltip>
                            }
                          />
                        </RadioGroup>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </ModelCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );

  return (
    <Box p={1} pt={-3} mt={-8}>
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard sx={{ p: 4, mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={3}>
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: '50%',
                  p: 2,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <TrendingUp sx={{ fontSize: 48, color: 'white' }} />
              </Box>
            </motion.div>
            <Box>
              <GradientTypography variant="h3" gutterBottom>
                Time Series Forecasting
              </GradientTypography>
              <Typography variant="subtitle1" color="text.secondary">
                Train and deploy advanced forecasting models with ease
              </Typography>
            </Box>
          </Stack>
        </GlassCard>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.2)}`,
                border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
              }}
              icon={
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <ErrorOutline />
                </motion.div>
              }
            >
              {error}
            </Alert>
          </motion.div>
        )}

        <FloatingCard>
          <Stepper 
            activeStep={activeStep} 
            orientation="vertical"
            sx={{ 
              background: 'transparent',
              p: 4,
              '& .MuiStepConnector-line': {
                borderColor: alpha(theme.palette.primary.main, 0.2),
                borderLeftStyle: 'dashed',
              },
            }}
          >
            <StyledStep>
              <StepLabel
                StepIconProps={{
                  sx: {
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: '50%',
                    p: 1,
                    color: 'white',
                  },
                }}
              >
                <Typography variant="h6">Select Data Source</Typography>
              </StepLabel>
              <StepContent>
                {renderDataSourceSelection()}
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!selectedDataSource || selectedFields.length === 0}
                  >
                    Continue
                  </Button>
                </Box>
              </StepContent>
            </StyledStep>

            <StyledStep>
              <StepLabel
                StepIconProps={{
                  sx: {
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: '50%',
                    p: 1,
                    color: 'white',
                  },
                }}
              >
                <Typography variant="h6">Choose Forecasting Model</Typography>
              </StepLabel>
              <StepContent>
                {renderModelSelection()}
                <Box sx={{ mt: 3 }}>
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!selectedModel}
                  >
                    Continue
                  </Button>
                </Box>
              </StepContent>
            </StyledStep>

            <StyledStep>
              <StepLabel
                StepIconProps={{
                  sx: {
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    borderRadius: '50%',
                    p: 1,
                    color: 'white',
                  },
                }}
              >
                <Typography variant="h6">Configure and Train</Typography>
              </StepLabel>
              <StepContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Stack spacing={3}>
                        <Typography variant="h6">Forecast Settings</Typography>
                        <TextField
                          fullWidth
                          type="number"
                          label="Forecast Period (days)"
                          value={forecastPeriod}
                          onChange={(e) => setForecastPeriod(parseInt(e.target.value))}
                          inputProps={{ min: 1, max: 365 }}
                        />
                        {renderConfigAccordion()}
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {renderModelInfo()}
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3 }}>
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleTrainModel}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <CompareArrows />}
                  >
                    {loading ? 'Training...' : 'Train and Forecast'}
                  </Button>
                </Box>
              </StepContent>
            </StyledStep>
          </Stepper>
        </FloatingCard>

        {forecast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard sx={{ mt: 4, p: 3 }}>
              {renderForecastChart()}
            </GlassCard>
          </motion.div>
        )}
      </motion.div>
    </Box>
  );
};

// Helper functions for parameter descriptions and ranges
const getParameterDescription = (param) => {
  const descriptions = {
    // Prophet parameters
    yearly_seasonality: 'Fit yearly seasonality in the model',
    weekly_seasonality: 'Fit weekly seasonality in the model',
    daily_seasonality: 'Fit daily seasonality in the model',
    changepoint_prior_scale: 'Flexibility of the trend',
    seasonality_prior_scale: 'Flexibility of the seasonality',
    holidays_prior_scale: 'Flexibility of the holiday effects',
    
    // ARIMA parameters
    order_p: 'Number of AR terms',
    order_d: 'Number of differences',
    order_q: 'Number of MA terms',
    
    // LSTM parameters
    epochs: 'Number of training iterations',
    batch_size: 'Number of samples per gradient update',
    neurons: 'Number of neurons in LSTM layer',
    
    // N-HITS parameters
    input_size: 'Length of input sequence',
    n_pools: 'Number of pooling layers',
    n_freq: 'Number of frequency components',
    num_stacks: 'Number of stacks in the architecture',
    num_blocks: 'Number of blocks per stack',
    num_layers: 'Number of layers per block',
    layer_widths: 'Width of hidden layers',
    learning_rate: 'Learning rate for optimization'
  };
  return descriptions[param] || 'Parameter description';
};

const getParameterRange = (param) => {
  const ranges = {
    changepoint_prior_scale: { min: 0.001, max: 0.5, step: 0.001 },
    seasonality_prior_scale: { min: 0.1, max: 20, step: 0.1 },
    neurons: { min: 10, max: 200, step: 10 },
    epochs: { min: 10, max: 200, step: 5 },
    batch_size: { min: 8, max: 128, step: 8 },
    input_size: { min: 10, max: 100, step: 5 },
    n_pools: { min: 1, max: 5, step: 1 },
    n_freq: { min: 1, max: 5, step: 1 },
    num_stacks: { min: 1, max: 5, step: 1 },
    num_blocks: { min: 1, max: 3, step: 1 },
    num_layers: { min: 1, max: 4, step: 1 },
    layer_widths: { min: 64, max: 1024, step: 64 },
    learning_rate: { min: 0.00001, max: 0.01, step: 0.00001 }
  };
  return ranges[param] || { min: 0, max: 100, step: 1 };
};

export default Forecasting; 