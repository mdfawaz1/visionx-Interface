import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  InputAdornment,
  OutlinedInput,
  IconButton,
  Button,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Typography,
  Tooltip,
  useTheme,
  alpha,
  Divider,
  Stack,
  Card,
  CardContent,
  Fade,
  Zoom,
  Collapse
} from '@mui/material';
import {
  Search,
  CloseOutlined,
  FilterList,
  Bookmarks,
  Timeline,
  Delete,
  ErrorOutline,
  WarningAmber,
  Info,
  CheckCircle,
  Code,
  Clear,
  FilterAlt,
  LabelOutlined,
  BookmarkBorder
} from '@mui/icons-material';

const LogToolbar = ({
  searchText,
  setSearchText,
  setFilterDrawerOpen,
  activeFilters,
  clearAllFilters,
  removeFilter,
  itemsPerPage,
  setItemsPerPage,
  tabValue,
  setTabValue,
  levelCounts,
  setActiveFilters
}) => {
  const theme = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Get total log count
  const totalLogCount = Object.values(levelCounts || {}).reduce((sum, count) => sum + count, 0);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Apply a level filter based on tab selection
    if (newValue === 0) {
      // Remove any existing level filters
      setActiveFilters(filters => filters.filter(f => f.field !== 'level'));
    } else {
      const levelMap = ['error', 'warn', 'info', 'debug'];
      const level = levelMap[newValue - 1];
      
      // Remove any existing level filters first
      const filtersWithoutLevel = activeFilters.filter(f => f.field !== 'level');
      
      // Add the new level filter
      setActiveFilters([
        ...filtersWithoutLevel,
        { field: 'level', operator: 'contains', value: level }
      ]);
    }
  };
  
  // Get severity color
  const getSeverityColor = (level) => {
    if (level === 'error') return theme.palette.error.main;
    if (level === 'warn') return theme.palette.warning.main;
    if (level === 'info') return theme.palette.info.main;
    if (level === 'debug') return theme.palette.success.main;
    return theme.palette.text.primary;
  };
  
  // Get severity icon
  const getSeverityIcon = (level) => {
    if (level === 'error') return <ErrorOutline fontSize="small" />;
    if (level === 'warn') return <WarningAmber fontSize="small" />;
    if (level === 'info') return <Info fontSize="small" />;
    if (level === 'debug') return <CheckCircle fontSize="small" />;
    return <Code fontSize="small" />;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2,
          borderRadius: 2,
          position: 'sticky',
          top: 16,
          zIndex: 10,
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.8)})` 
            : `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.8)})`,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Search and Filters Row */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          {/* Search Input */}
          <Grid item xs={12} md={7} lg={8}>
            <Box 
              sx={{ 
                position: 'relative',
                transition: 'all 0.3s ease',
                transform: searchFocused ? 'scale(1.01)' : 'scale(1)'
              }}
            >
              <OutlinedInput
                fullWidth
                placeholder="Search in logs..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                startAdornment={
                  <InputAdornment position="start">
                    <Zoom in={!searchFocused}>
                      <Search color="action" />
                    </Zoom>
                    <Zoom in={searchFocused}>
                      <Search color="primary" sx={{ position: 'absolute', left: 12 }} />
                    </Zoom>
                  </InputAdornment>
                }
                endAdornment={
                  searchText && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchText('')} edge="end">
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  )
                }
                sx={{
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  transition: 'all 0.3s ease',
                  boxShadow: searchFocused ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.3)}`
                  }
                }}
              />
            </Box>
          </Grid>
          
          {/* Filter Button & Items Per Page */}
          <Grid item xs={12} md={5} lg={4}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setFilterDrawerOpen(true)}
                startIcon={
                  <Badge badgeContent={activeFilters.length} color="error" max={99}>
                    <FilterList />
                  </Badge>
                }
                sx={{ 
                  borderRadius: 2,
                  flex: 1,
                  height: '100%',
                  borderColor: activeFilters.length > 0 
                    ? theme.palette.primary.main 
                    : theme.palette.divider,
                  bgcolor: activeFilters.length > 0 
                    ? alpha(theme.palette.primary.main, 0.1) 
                    : 'transparent',
                  '&:hover': {
                    bgcolor: activeFilters.length > 0 
                      ? alpha(theme.palette.primary.main, 0.15) 
                      : alpha(theme.palette.background.paper, 0.8)
                  }
                }}
              >
                {activeFilters.length > 0 ? `${activeFilters.length} Filters` : 'Filters'}
              </Button>
              
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="items-per-page-label">Items Per Page</InputLabel>
                <Select
                  labelId="items-per-page-label"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(e.target.value)}
                  label="Items Per Page"
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.8)
                  }}
                >
                  <MenuItem value={10}>10 items</MenuItem>
                  <MenuItem value={25}>25 items</MenuItem>
                  <MenuItem value={50}>50 items</MenuItem>
                  <MenuItem value={100}>100 items</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
        
        {/* Active Filters */}
        <Collapse in={activeFilters.length > 0}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 1 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterAlt fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', opacity: 0.7 }} />
                <Typography variant="body2" color="text.secondary">
                  Active Filters:
                </Typography>
              </Box>
              
              <Button
                size="small"
                onClick={clearAllFilters}
                startIcon={<Clear fontSize="small" />}
                variant="text"
                color="error"
                sx={{ py: 0 }}
              >
                Clear All
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {activeFilters.map((filter, index) => (
                <Chip
                  key={index}
                  label={`${filter.field} ${filter.operator} ${filter.value || ''}`}
                  onDelete={() => removeFilter(index)}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderRadius: '4px',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
        </Collapse>
        
        {/* Log Level Tabs */}
        <Box>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0'
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                minHeight: 48,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: alpha(theme.palette.action.hover, 0.1)
                }
              }
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2">All Logs</Typography>
                  <Chip 
                    label={totalLogCount} 
                    size="small" 
                    sx={{ ml: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }} 
                  />
                </Box>
              } 
            />
            
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ErrorOutline fontSize="small" sx={{ mr: 0.5, color: theme.palette.error.main }} />
                  <Typography variant="body2">Errors</Typography>
                  <Chip 
                    label={levelCounts?.error || 0} 
                    size="small" 
                    sx={{ 
                      ml: 1, 
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main
                    }} 
                  />
                </Box>
              } 
              wrapped 
              sx={{ color: tabValue === 1 ? theme.palette.error.main : 'inherit' }}
            />
            
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WarningAmber fontSize="small" sx={{ mr: 0.5, color: theme.palette.warning.main }} />
                  <Typography variant="body2">Warnings</Typography>
                  <Chip 
                    label={levelCounts?.warn || 0} 
                    size="small" 
                    sx={{ 
                      ml: 1, 
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main
                    }} 
                  />
                </Box>
              } 
              wrapped 
              sx={{ color: tabValue === 2 ? theme.palette.warning.main : 'inherit' }}
            />
            
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Info fontSize="small" sx={{ mr: 0.5, color: theme.palette.info.main }} />
                  <Typography variant="body2">Info</Typography>
                  <Chip 
                    label={levelCounts?.info || 0} 
                    size="small" 
                    sx={{ 
                      ml: 1, 
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main
                    }} 
                  />
                </Box>
              } 
              wrapped 
              sx={{ color: tabValue === 3 ? theme.palette.info.main : 'inherit' }}
            />
            
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle fontSize="small" sx={{ mr: 0.5, color: theme.palette.success.main }} />
                  <Typography variant="body2">Debug</Typography>
                  <Chip 
                    label={levelCounts?.debug || 0} 
                    size="small" 
                    sx={{ 
                      ml: 1, 
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main
                    }} 
                  />
                </Box>
              } 
              wrapped 
              sx={{ color: tabValue === 4 ? theme.palette.success.main : 'inherit' }}
            />
          </Tabs>
        </Box>
      </Paper>
    </Box>
  );
};

export default LogToolbar;