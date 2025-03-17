import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Box,
  Typography, 
  Paper, 
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination
} from '@mui/material';
import api from '../../api';

// Import components
import {
  SystemMetrics,
  LogStats,
  IncidentSummary,
  PerformanceMetricsSummary,
  FilterDrawer,
  LogContentViewer,
  LogHeader,
  LogToolbar,
  FetchOptionsPanel
} from './components';

// Common log levels with their colors
const LOG_LEVELS = {
  trace: { color: '#6c757d', backgroundColor: '#f8f9fa' },
  debug: { color: '#0dcaf0', backgroundColor: '#e8f7fa' },
  info: { color: '#0d6efd', backgroundColor: '#e6f2ff' },
  warn: { color: '#ffc107', backgroundColor: '#fff8e6' },
  warning: { color: '#ffc107', backgroundColor: '#fff8e6' },
  error: { color: '#dc3545', backgroundColor: '#f8e7e9' },
  fatal: { color: '#fff', backgroundColor: '#6f42c1' }
};

const LogViewer = () => {
  // Basic states
  const [rawLogs, setRawLogs] = useState('');
  const [parsedLogs, setParsedLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logInfo, setLogInfo] = useState(null);
  
  // Log selection
  const [logName, setLogName] = useState('hairnet_detection');
  const [availableLogNames, setAvailableLogNames] = useState(['hairnet_detection', 'ai-platform-api', '__main__']);
  
  // Fetch options
  const [fetchOption, setFetchOption] = useState('lastNLines');
  const [linesCount, setLinesCount] = useState(100);
  const [sinceTimestamp, setSinceTimestamp] = useState('');
  const [byteOffset, setByteOffset] = useState(0);
  
  // View options
  const [viewMode, setViewMode] = useState('formatted'); // 'formatted' or 'raw'
  const [darkMode, setDarkMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(10); // seconds
  
  // Filtering and search
  const [searchText, setSearchText] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  
  // Refs
  const logContentRef = useRef(null);
  const refreshTimerRef = useRef(null);
  
  // Field to filter mapping
  const [fieldToFilter, setFieldToFilter] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filterOperator, setFilterOperator] = useState('contains');
  
  // Saved filter presets
  const [savedFilters, setSavedFilters] = useState([]);
  const [currentPresetName, setCurrentPresetName] = useState('');

  // Add system metrics state
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: { usage: 0, temperature: 0 },
    memory: { total: 0, used: 0, free: 0 },
    disk: { total: 0, used: 0, free: 0 },
    network: { bytesReceived: 0, bytesSent: 0 }
  });

  // Add metrics loading state
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Add predefined filter presets for stream metrics
  useEffect(() => {
    // Add default filter presets for stream metrics if none exist
    if (savedFilters.length === 0) {
      setSavedFilters([
        {
          id: 1,
          name: "High FPS (>25)",
          filters: [{
            id: Date.now(),
            field: "message",
            operator: "contains",
            value: "FPS:",
          }, {
            id: Date.now() + 1,
            field: "message",
            operator: "greaterThan",
            value: "25"
          }]
        },
        {
          id: 2,
          name: "Low FPS (<20)",
          filters: [{
            id: Date.now() + 2,
            field: "message",
            operator: "contains",
            value: "FPS:",
          }, {
            id: Date.now() + 3,
            field: "message",
            operator: "lessThan",
            value: "20"
          }]
        },
        {
          id: 3,
          name: "Frame Skips",
          filters: [{
            id: Date.now() + 4,
            field: "message",
            operator: "contains",
            value: "Frame skip:",
          }, {
            id: Date.now() + 5,
            field: "message",
            operator: "greaterThan",
            value: "0"
          }]
        }
      ]);
    }
  }, []);

  // Remove the separate metrics interval useEffect and combine with logs auto-refresh
  useEffect(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    
    if (autoRefresh) {
      fetchLogs();
      fetchMetrics();
      refreshTimerRef.current = setInterval(() => {
        fetchLogs();
        fetchMetrics();
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [autoRefresh, refreshInterval]);

  // Initial fetch on mount
  useEffect(() => {
    fetchLogInfo();
    fetchLogs();
    fetchMetrics();
    
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);
  
  // Parse logs whenever raw logs change
  useEffect(() => {
    if (!rawLogs) {
      setParsedLogs([]);
      setFilteredLogs([]);
      return;
    }
    
    try {
      // Split by newline and parse each line as JSON
      const lines = rawLogs.trim().split('\n');
      const parsed = lines.map((line, index) => {
        try {
          return { ...JSON.parse(line), __lineNumber: index + 1 };
        } catch (err) {
          return { 
            __raw: line, 
            __error: 'Parse error', 
            __lineNumber: index + 1,
            level: 'error',
            message: line
          };
        }
      });
      
      setParsedLogs(parsed);
      
      // Extract all unique fields for filtering
      const fields = new Set();
      parsed.forEach(log => {
        Object.keys(log).forEach(key => {
          if (!key.startsWith('__')) {
            fields.add(key);
          }
        });
      });
      
      setAvailableFields(Array.from(fields).sort());
    } catch (err) {
      console.error('Error parsing logs:', err);
      setError('Failed to parse logs as JSON. Some entries may not be valid JSON.');
    }
  }, [rawLogs]);
  
  // Apply filters whenever parsed logs or filters change
  useEffect(() => {
    applyFilters();
  }, [parsedLogs, activeFilters, searchText]);
  
  // Reset to page 1 when filtered logs change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredLogs]);

  const fetchLogInfo = async () => {
    try {
      const response = await api.get(`/logs/${logName}/info`);
      setLogInfo(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch log info');
      console.error('Error fetching log info:', err);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    
    let params = {};
    
    // Add query parameters based on selected option
    switch (fetchOption) {
      case 'lastNLines':
        params.lines = linesCount;
        break;
      case 'allLines':
        params.all = true;
        break;
      case 'sinceTimestamp':
        params.since = sinceTimestamp;
        break;
      case 'byteOffset':
        params.offset = byteOffset;
        break;
      default:
        params.lines = 1000; // Default to last 100 lines
    }
    
    try {
      const response = await api.get(`/logs/${logName}/content`, { params });
      
      // Extract the content from the wrapper
      if (response.data.content) {
        setRawLogs(response.data.content);
        // Store additional metadata if needed
        setLogInfo({
          ...logInfo,
          totalSize: response.data.totalSize,
          retrievedLines: response.data.retrievedLines
        });
      } else {
        setRawLogs('');
      }
      scrollToBottom();
    } catch (err) {
      setError(err.message || 'Failed to fetch logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.open(`${api.defaults.baseURL}/logs/${logName}/download`);
  };

  const handleClear = () => {
    setRawLogs('');
    setParsedLogs([]);
    setFilteredLogs([]);
  };

  const scrollToBottom = () => {
    if (logContentRef.current) {
      logContentRef.current.scrollTop = logContentRef.current.scrollHeight;
    }
  };
  
  const applyFilters = () => {
    let filtered = [...parsedLogs];
    
    // Apply all active filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(log => {
        return activeFilters.every(filter => {
          const { field, operator, value } = filter;
          
          if (!log[field] && log[field] !== 0 && log[field] !== false) {
            return false;
          }
          
          const logValue = String(log[field]).toLowerCase();
          const filterValue = String(value).toLowerCase();
          
          switch (operator) {
            case 'contains':
              return logValue.includes(filterValue);
            case 'equals':
              return logValue === filterValue;
            case 'startsWith':
              return logValue.startsWith(filterValue);
            case 'endsWith':
              return logValue.endsWith(filterValue);
            case 'doesNotContain':
              return !logValue.includes(filterValue);
            case 'greaterThan':
              return parseFloat(logValue) > parseFloat(filterValue);
            case 'lessThan':
              return parseFloat(logValue) < parseFloat(filterValue);
            default:
              return true;
          }
        });
      });
    }
    
    // Apply search text if any
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(log => {
        // For raw entries
        if (log.__raw) {
          return log.__raw.toLowerCase().includes(searchLower);
        }
        
        // For JSON entries, search in all values
        return Object.entries(log).some(([key, value]) => {
          if (key.startsWith('__')) return false;
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    }
    
    setFilteredLogs(filtered);
  };
  
  const addFilter = () => {
    if (!fieldToFilter || !filterValue) return;
    
    const newFilter = {
      id: Date.now(),
      field: fieldToFilter,
      operator: filterOperator,
      value: filterValue
    };
    
    setActiveFilters([...activeFilters, newFilter]);
    setFieldToFilter('');
    setFilterValue('');
    setFilterOperator('contains');
  };
  
  const removeFilter = (filterId) => {
    setActiveFilters(activeFilters.filter(filter => filter.id !== filterId));
  };
  
  const saveFilterPreset = () => {
    if (!currentPresetName || activeFilters.length === 0) return;
    
    const newPreset = {
      id: Date.now(),
      name: currentPresetName,
      filters: [...activeFilters]
    };
    
    setSavedFilters([...savedFilters, newPreset]);
    setCurrentPresetName('');
  };
  
  const loadFilterPreset = (preset) => {
    setActiveFilters([...preset.filters]);
  };
  
  const deleteFilterPreset = (presetId) => {
    setSavedFilters(savedFilters.filter(preset => preset.id !== presetId));
  };
  
  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchText('');
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setError('Log copied to clipboard');
      },
      (err) => {
        console.error('Failed to copy: ', err);
        setError('Failed to copy log');
      }
    );
  };
  
  // Calculate paginated logs
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);
  
  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  
  // Get level counts for badges
  const levelCounts = useMemo(() => {
    const counts = {};
    
    filteredLogs.forEach(log => {
      const level = log.level?.toLowerCase() || 'unknown';
      counts[level] = (counts[level] || 0) + 1;
    });
    
    return counts;
  }, [filteredLogs]);
  
  const fetchMetrics = async () => {
    try {
      setMetricsLoading(true);
      const response = await api.get('/system/metrics');
      setSystemMetrics(response.data);
    } catch (err) {
      console.error('Error fetching system metrics:', err);
    } finally {
      setMetricsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Header with title and controls */}
      <LogHeader 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        viewMode={viewMode}
        setViewMode={setViewMode}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        refreshInterval={refreshInterval}
        setRefreshInterval={setRefreshInterval}
      />
      
      {/* Log Selection */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1">Select Log Source:</Typography>
        <Box sx={{ minWidth: 200 }}>
          <select
            value={logName}
            onChange={(e) => {
              setLogName(e.target.value);
              fetchLogInfo();
              fetchLogs();
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%'
            }}
          >
            {availableLogNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </Box>
      </Paper>
      
      {/* System Metrics */}
      <SystemMetrics systemMetrics={systemMetrics} metricsLoading={metricsLoading} />
      
      {/* Incident Summary */}
      <IncidentSummary logs={parsedLogs} />
      
      {/* Log Statistics */}
      <LogStats logs={parsedLogs} />
      
      {/* Performance Metrics Summary */}
      <PerformanceMetricsSummary logs={parsedLogs} />
      
      {/* Log fetch options */}
      <FetchOptionsPanel 
        fetchOption={fetchOption}
        setFetchOption={setFetchOption}
        linesCount={linesCount}
        setLinesCount={setLinesCount}
        sinceTimestamp={sinceTimestamp}
        setSinceTimestamp={setSinceTimestamp}
        byteOffset={byteOffset}
        setByteOffset={setByteOffset}
        loading={loading}
        fetchLogs={fetchLogs}
        handleClear={handleClear}
        handleDownload={handleDownload}
        logInfo={logInfo}
      />
      
      {/* Search and Filter Toolbar */}
      <LogToolbar 
        searchText={searchText}
        setSearchText={setSearchText}
        setFilterDrawerOpen={setFilterDrawerOpen}
        activeFilters={activeFilters}
        clearAllFilters={clearAllFilters}
        removeFilter={removeFilter}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        tabValue={tabValue}
        setTabValue={setTabValue}
        levelCounts={levelCounts}
        setActiveFilters={setActiveFilters}
      />
      
      {/* Stats Bar */}
      <Paper sx={{ p: 1, mb: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body2">
              Showing {paginatedLogs.length} of {filteredLogs.length} entries
              {filteredLogs.length !== parsedLogs.length && ` (filtered from ${parsedLogs.length} total)`}
            </Typography>
          </Grid>
          <Grid item>
            <Pagination 
              count={totalPages} 
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              size="small"
              siblingCount={1}
              boundaryCount={1}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Log content display */}
      <LogContentViewer 
        logs={filteredLogs} 
        isLoading={loading}
        darkMode={darkMode}
        viewMode={viewMode}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        searchText={searchText}
        totalPages={totalPages}
      />
      
      {/* Filter Drawer */}
      <FilterDrawer 
        filterDrawerOpen={filterDrawerOpen}
        setFilterDrawerOpen={setFilterDrawerOpen}
        fieldToFilter={fieldToFilter}
        setFieldToFilter={setFieldToFilter}
        filterOperator={filterOperator}
        setFilterOperator={setFilterOperator}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        addFilter={addFilter}
        availableFields={availableFields}
        activeFilters={activeFilters}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
        currentPresetName={currentPresetName}
        setCurrentPresetName={setCurrentPresetName}
        saveFilterPreset={saveFilterPreset}
        savedFilters={savedFilters}
        loadFilterPreset={loadFilterPreset}
        deleteFilterPreset={deleteFilterPreset}
      />
      
      {/* Error message */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LogViewer; 