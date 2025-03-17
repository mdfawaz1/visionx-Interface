import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  alpha,
  Paper,
  Chip,
  Stack,
  Tabs,
  Tab,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  InputAdornment,
  Tooltip,
  Alert,
  Autocomplete
} from '@mui/material';
import {
  CloseOutlined,
  SaveOutlined,
  RestoreOutlined,
  DeleteOutlined,
  FilterList,
  Add,
  Search,
  Clear,
  DeleteSweep,
  Bookmark,
  CheckCircle,
  Error,
  Warning,
  Info,
  CalendarToday,
  ArrowForward,
  Equalizer,
  Label,
  Favorite,
  FavoriteBorder,
  MoreVert
} from '@mui/icons-material';

const FilterDrawer = ({
  filterDrawerOpen,
  setFilterDrawerOpen,
  fieldToFilter,
  setFieldToFilter,
  filterOperator,
  setFilterOperator,
  filterValue,
  setFilterValue,
  addFilter,
  availableFields,
  activeFilters,
  removeFilter,
  clearAllFilters,
  currentPresetName,
  setCurrentPresetName,
  saveFilterPreset,
  savedFilters,
  loadFilterPreset,
  deleteFilterPreset
}) => {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [presetError, setPresetError] = useState('');
  const [filterError, setFilterError] = useState('');
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  
  // Handle filter addition
  const handleAddFilter = () => {
    if (!fieldToFilter) {
      setFilterError('Please select a field to filter');
      return;
    }
    
    if (!filterOperator) {
      setFilterError('Please select a filter operator');
      return;
    }
    
    if (!filterValue && filterOperator !== 'exists' && filterOperator !== 'notExists') {
      setFilterError('Please enter a filter value');
      return;
    }
    
    setFilterError('');
    addFilter();
  };
  
  // Handle save preset
  const handleSavePreset = () => {
    if (!currentPresetName || currentPresetName.trim() === '') {
      setPresetError('Please enter a name for your preset');
      return;
    }
    
    if (savedFilters.some(f => f.name === currentPresetName) && 
        !window.confirm(`Preset "${currentPresetName}" already exists. Overwrite?`)) {
      return;
    }
    
    setPresetError('');
    saveFilterPreset();
    setSaveDialogOpen(false);
  };
  
  // Handle preset deletion confirmation
  const handleConfirmDelete = (presetName) => {
    setPresetToDelete(presetName);
    setConfirmDelete(true);
  };
  
  // Execute preset deletion
  const executeDelete = () => {
    deleteFilterPreset(presetToDelete);
    setConfirmDelete(false);
    setPresetToDelete('');
  };
  
  // Get color for filter chip based on operator
  const getFilterColor = (operator) => {
    switch(operator) {
      case 'contains':
      case 'equals':
        return theme.palette.primary.main;
      case 'startsWith':
      case 'endsWith':
        return theme.palette.info.main;
      case 'greaterThan':
      case 'lessThan':
        return theme.palette.success.main;
      case 'notContains':
      case 'notEquals':
        return theme.palette.error.main;
      case 'exists':
      case 'notExists':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  // Get operator display text
  const getOperatorDisplay = (op) => {
    const operatorMap = {
      equals: '=',
      notEquals: '≠',
      contains: 'contains',
      notContains: 'not contains',
      startsWith: 'starts with',
      endsWith: 'ends with',
      greaterThan: '>',
      lessThan: '<',
      exists: 'exists',
      notExists: 'not exists'
    };
    
    return operatorMap[op] || op;
  };
  
  // Get filter icon based on field type
  const getFilterIcon = (field) => {
    if (field.includes('level') || field.includes('severity')) {
      return <Equalizer fontSize="small" />;
    } else if (field.includes('time') || field.includes('date')) {
      return <CalendarToday fontSize="small" />;
    } else if (field.includes('message') || field.includes('content')) {
      return <Info fontSize="small" />;
    } else if (field.includes('error')) {
      return <Error fontSize="small" />;
    } else {
      return <Label fontSize="small" />;
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 450 },
            maxWidth: '100%',
            p: 0
          }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.primary.main, 0.08)
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterList sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6">Filter Logs</Typography>
            </Box>
            <IconButton onClick={() => setFilterDrawerOpen(false)} size="small">
              <CloseOutlined />
            </IconButton>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabIndex} 
              onChange={handleTabChange} 
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab 
                label="Filters" 
                icon={<FilterList />} 
                iconPosition="start"
              />
              <Tab 
                label="Presets" 
                icon={<Bookmark />} 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Filters Tab */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              display: tabIndex === 0 ? 'block' : 'none',
              p: 2
            }}
          >
            {/* Create filter section */}
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                mb: 3, 
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <Typography 
                variant="subtitle1" 
                fontWeight="medium" 
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
              >
                <Add fontSize="small" sx={{ mr: 1 }} />
                Add New Filter
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    value={fieldToFilter}
                    onChange={(e, newValue) => setFieldToFilter(newValue)}
                    options={availableFields || []}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Field"
                        variant="outlined"
                        size="small"
                        fullWidth
                        error={filterError && !fieldToFilter}
                        helperText={filterError && !fieldToFilter ? 'Required field' : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small" error={filterError && !filterOperator}>
                    <InputLabel>Operator</InputLabel>
                    <Select
                      value={filterOperator}
                      label="Operator"
                      onChange={(e) => setFilterOperator(e.target.value)}
                    >
                      <MenuItem value="equals">Equals (=)</MenuItem>
                      <MenuItem value="notEquals">Not Equals (≠)</MenuItem>
                      <MenuItem value="contains">Contains</MenuItem>
                      <MenuItem value="notContains">Not Contains</MenuItem>
                      <MenuItem value="startsWith">Starts With</MenuItem>
                      <MenuItem value="endsWith">Ends With</MenuItem>
                      <MenuItem value="greaterThan">Greater Than (&gt;)</MenuItem>
                      <MenuItem value="lessThan">Less Than (&lt;)</MenuItem>
                      <MenuItem value="exists">Exists</MenuItem>
                      <MenuItem value="notExists">Not Exists</MenuItem>
                    </Select>
                    {filterError && !filterOperator && (
                      <Typography variant="caption" color="error">Required field</Typography>
                    )}
                  </FormControl>
                </Grid>
                {filterOperator !== 'exists' && filterOperator !== 'notExists' && (
                  <Grid item xs={12}>
                    <TextField
                      label="Value"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      fullWidth
                      size="small"
                      variant="outlined"
                      error={filterError && !filterValue && filterOperator !== 'exists' && filterOperator !== 'notExists'}
                      helperText={filterError && !filterValue && filterOperator !== 'exists' && filterOperator !== 'notExists' ? 'Required field' : ''}
                    />
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddFilter}
                      startIcon={<Add />}
                    >
                      Add Filter
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              
              {filterError && (
                <Alert severity="error" sx={{ mt: 2 }}>{filterError}</Alert>
              )}
            </Paper>

            {/* Active filters */}
            <Card 
              elevation={1} 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                overflow: 'visible'
              }}
            >
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FilterList fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" component="div">
                      Active Filters
                    </Typography>
                  </Box>
                }
                action={
                  activeFilters.length > 0 && (
                    <Tooltip title="Clear All Filters">
                      <IconButton 
                        size="small" 
                        onClick={clearAllFilters}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <DeleteSweep />
                      </IconButton>
                    </Tooltip>
                  )
                }
                sx={{ 
                  pb: 1,
                  '& .MuiCardHeader-title': {
                    fontSize: '1rem',
                    fontWeight: 500
                  }
                }}
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {activeFilters.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary" variant="body2">
                      No active filters. Add a filter to refine log results.
                    </Typography>
                  </Box>
                ) : (
                  <List dense disablePadding>
                    {activeFilters.map((filter, index) => (
                      <ListItem
                        key={index}
                        sx={{ 
                          py: 1.5,
                          borderBottom: index < activeFilters.length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none'
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                              <Chip
                                label={filter.field}
                                size="small"
                                icon={getFilterIcon(filter.field)}
                                sx={{ 
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main
                                }}
                              />
                              <ArrowForward fontSize="small" sx={{ color: theme.palette.text.secondary, mx: 0.5 }} />
                              <Chip
                                label={getOperatorDisplay(filter.operator)}
                                size="small"
                                sx={{ 
                                  bgcolor: alpha(getFilterColor(filter.operator), 0.1),
                                  color: getFilterColor(filter.operator)
                                }}
                              />
                              {(filter.operator !== 'exists' && filter.operator !== 'notExists') && (
                                <>
                                  <ArrowForward fontSize="small" sx={{ color: theme.palette.text.secondary, mx: 0.5 }} />
                                  <Chip
                                    label={filter.value}
                                    size="small"
                                    sx={{ 
                                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                      color: theme.palette.secondary.main
                                    }}
                                  />
                                </>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => removeFilter(index)}
                            sx={{ color: theme.palette.error.light }}
                          >
                            <DeleteOutlined fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Save preset button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setSaveDialogOpen(true)}
                startIcon={<SaveOutlined />}
                disabled={activeFilters.length === 0}
              >
                Save as Preset
              </Button>
            </Box>
          </Box>

          {/* Presets Tab */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflowY: 'auto',
              display: tabIndex === 1 ? 'block' : 'none',
              p: 2
            }}
          >
            {savedFilters && savedFilters.length > 0 ? (
              <Grid container spacing={2}>
                {savedFilters.map((preset, index) => (
                  <Grid item xs={12} key={index}>
                    <Card 
                      elevation={2} 
                      sx={{ 
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 4
                        }
                      }}
                    >
                      <CardHeader
                        title={preset.name}
                        subheader={`${preset.filters.length} filter${preset.filters.length !== 1 ? 's' : ''}`}
                        avatar={
                          <Avatar 
                            sx={{ 
                              bgcolor: theme.palette.primary.main
                            }}
                          >
                            <Bookmark />
                          </Avatar>
                        }
                        action={
                          <Box>
                            <IconButton
                              size="small"
                              onClick={() => loadFilterPreset(preset.name)}
                              sx={{ 
                                color: theme.palette.primary.main,
                                mr: 1
                              }}
                            >
                              <RestoreOutlined fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleConfirmDelete(preset.name)}
                              sx={{ color: theme.palette.error.main }}
                            >
                              <DeleteOutlined fontSize="small" />
                            </IconButton>
                          </Box>
                        }
                      />
                      <Divider />
                      <CardContent sx={{ pt: 1 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {preset.filters.map((filter, idx) => (
                            <Tooltip 
                              key={idx} 
                              title={`${filter.field} ${getOperatorDisplay(filter.operator)} ${filter.value || ''}`}
                              arrow
                            >
                              <Chip
                                label={`${filter.field.substring(0, 10)}${filter.field.length > 10 ? '...' : ''}`}
                                size="small"
                                icon={getFilterIcon(filter.field)}
                                sx={{ 
                                  m: 0.5,
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main
                                }}
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  p: 4
                }}
              >
                <Bookmark sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom align="center">
                  No Saved Presets
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  Create filters and save them as presets for quick access
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setTabIndex(0)}
                  startIcon={<FilterList />}
                >
                  Go to Filters
                </Button>
              </Box>
            )}
          </Box>
          
          {/* Drawer footer */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              bgcolor: alpha(theme.palette.background.default, 0.5)
            }}
          >
            <Button
              onClick={() => setFilterDrawerOpen(false)}
              startIcon={<CloseOutlined />}
            >
              Close
            </Button>
            
            <Button
              variant="contained"
              color="error"
              onClick={clearAllFilters}
              disabled={activeFilters.length === 0}
              startIcon={<DeleteSweep />}
            >
              Clear All Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
      
      {/* Save preset dialog */}
      <Dialog 
        open={saveDialogOpen} 
        onClose={() => setSaveDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Save Filter Preset</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              label="Preset Name"
              fullWidth
              value={currentPresetName}
              onChange={(e) => setCurrentPresetName(e.target.value)}
              error={!!presetError}
              helperText={presetError}
              autoFocus
              margin="dense"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Bookmark />
                  </InputAdornment>
                ),
              }}
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
              This preset will save {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''}:
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {activeFilters.map((filter, idx) => (
                <Chip
                  key={idx}
                  label={`${filter.field} ${getOperatorDisplay(filter.operator)} ${filter.value || ''}`}
                  size="small"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSavePreset} 
            color="primary" 
            variant="contained"
            disabled={!currentPresetName}
          >
            Save Preset
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
      >
        <DialogTitle>Delete Preset</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the preset "{presetToDelete}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button
            onClick={executeDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FilterDrawer;