import React, { useState } from 'react';
import { Box, Grid, Typography, Paper, Chip, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WarningIcon from '@mui/icons-material/Warning';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import GetAppIcon from '@mui/icons-material/GetApp';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import IncidentStatCard from './components/IncidentStatCard';
import IncidentTrendsChart from './components/IncidentTrendsChart';
import IncidentDistributionChart from './components/IncidentDistributionChart';
import RecentIncidentsList from './components/RecentIncidentsList';
import IncidentDetails from './components/IncidentDetails';
import IncidentImage from './components/IncidentImage';

const HeaderWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
}));
const StyledPaper2 = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    height: '100%',
    marginBottom: '10px',
  }));

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

// Compact corner label with blue color
const DemoCornerLabel = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -15,
  left: -15,
  zIndex: 10,
  overflow: 'hidden',
  width: 50,
  height: 50,
  pointerEvents: 'none',
  '&::before': {
    content: '"DEMO"',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '120%',
    height: '18px',
    backgroundColor: '#1976d2', // Changed to blue
    color: 'white',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    top: '12px',
    left: '-15%',
    transform: 'rotate(-45deg)',
    transformOrigin: 'center',
    fontSize: '9px',
    letterSpacing: '0.5px',
  }
}));

const DemoWatermark = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) rotate(-30deg)',
  fontSize: '120px',
  fontWeight: 'bold',
  color: 'rgba(233, 30, 99, 0.07)',
  pointerEvents: 'none',
  zIndex: 1100,
  letterSpacing: '15px',
  textTransform: 'uppercase',
  userSelect: 'none',
  whiteSpace: 'nowrap',
}));

const SafetyDashboard = () => {
  // Add the filter state
  const [filters, setFilters] = useState({
    noHairnet: true,
    noGloves: true,
    noMask: true,
    noShoes: true
  });

  const toggleFilter = (filter) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  return (
    <Box sx={{ padding: 2, marginTop: -8, backgroundColor: '#f5f7fa', position: 'relative' }}>
      {/* Demo label now inside the main box */}
      <DemoCornerLabel />
      
      <Grid container spacing={2}>
        {/* Incident Stats Row */}
        <Grid item xs={12} md={2.4}>
          <IncidentStatCard 
            title="Total Incidents"
            value={156}
            comparison="vs 144 last month"
            change="+8.3%"
            isPositive={false}
            icon="⚠️"
            status="Alert"
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <IncidentStatCard 
            title="No Hairnet"
            value={42}
            comparison="vs 37 last month"
            change="+12.5%"
            isPositive={false}
            icon="🧢"
            status="Alert"
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <IncidentStatCard 
            title="No Gloves"
            value={38}
            comparison="vs 40 last month"
            change="-5.1%"
            isPositive={true}
            icon="🧤"
            status="Improving"
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <IncidentStatCard 
            title="No Mask"
            value={45}
            comparison="vs 39 last month"
            change="+14.2%"
            isPositive={false}
            icon="😷"
            status="Alert"
          />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <IncidentStatCard 
            title="No Shoes"
            value={31}
            comparison="vs 32 last month"
            change="-2.1%"
            isPositive={true}
            icon="👞"
            status="Improving"
          />
        </Grid>

        {/* Charts Row */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6">Incident Trends</Typography>
              <Box>
                <Chip 
                  size="small" 
                  sx={{ marginTop: '-10px' }}
                  label="Last 6 Months" 
                  variant="outlined" 
                  icon={<InsertChartIcon fontSize="small" />}
                />
                <GetAppIcon fontSize="small" sx={{ ml: 1 }} />
                <FullscreenIcon fontSize="small" sx={{ ml: 1 }} />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" component="span" sx={{ mr: 2, color: '#555' }}>
                Filters:
              </Typography>
              <Box sx={{ display: 'inline-flex', gap: 1 }}>
                <Chip 
                  label="No Hairnet" 
                  
                  size="small"
                  onClick={() => toggleFilter('noHairnet')}
                  sx={{ 
                    backgroundColor: filters.noHairnet ? 'rgba(136, 132, 216, 0.15)' : '#f5f5f5',
                    color: filters.noHairnet ? '#8884d8' : '#888',
                    borderRadius: '16px',
                    
                  }}
                  variant={filters.noHairnet ? "filled" : "outlined"}
                />
                <Chip 
                  label="No Gloves" 
                  size="small"
                  onClick={() => toggleFilter('noGloves')}
                  sx={{ 
                    backgroundColor: filters.noGloves ? 'rgba(69, 114, 205, 0.15)' : '#f5f5f5',
                    color: filters.noGloves ? '#4572cd' : '#888',
                    borderRadius: '16px',
                  }}
                  variant={filters.noGloves ? "filled" : "outlined"}
                />
                <Chip 
                  label="No Mask" 
                  size="small"
                  onClick={() => toggleFilter('noMask')}
                  sx={{ 
                    backgroundColor: filters.noMask ? 'rgba(76, 175, 80, 0.15)' : '#f5f5f5',
                    color: filters.noMask ? '#4caf50' : '#888',
                    borderRadius: '16px',
                  }}
                  variant={filters.noMask ? "filled" : "outlined"}
                />
                <Chip 
                  label="No Shoes" 
                  size="small"
                  onClick={() => toggleFilter('noShoes')}
                  sx={{ 
                    backgroundColor: filters.noShoes ? 'rgba(239, 83, 80, 0.15)' : '#f5f5f5',
                    color: filters.noShoes ? '#ef5350' : '#888',
                    borderRadius: '16px',
                  }}
                  variant={filters.noShoes ? "filled" : "outlined"}
                />
              </Box>
            </Box>
            <IncidentTrendsChart filters={filters} />
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6">Incident Distribution</Typography>
              <Box>
                <Chip 
                  sx={{ marginTop: '-10px' }}
                  size="small" 
                  label="Jul 2025" 
                  variant="outlined" 
                />
                <GetAppIcon fontSize="small" sx={{ ml: 1 }} />
                <FullscreenIcon fontSize="small" sx={{ ml: 1 }} />
              </Box>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>Filters:</Typography>
              <FilterChip 
                size="small" 
                label="No Hairnet" 
                color="secondary" 
                variant="outlined" 
                icon={<Typography sx={{ fontSize: '0.75rem' }}>🧢</Typography>} 
              />
              <FilterChip 
                size="small" 
                label="No Gloves" 
                color="primary" 
                variant="outlined" 
                icon={<Typography sx={{ fontSize: '0.75rem' }}>🧤</Typography>} 
              />
              <FilterChip 
                size="small" 
                label="No Mask" 
                color="success" 
                variant="outlined" 
                icon={<Typography sx={{ fontSize: '0.75rem' }}>😷</Typography>} 
              />
              <FilterChip 
                size="small" 
                label="No Shoes" 
                color="error" 
                variant="outlined" 
                icon={<Typography sx={{ fontSize: '0.75rem' }}>👞</Typography>} 
              />
            </Box>
            <IncidentDistributionChart />
          </StyledPaper>
        </Grid>

        {/* Bottom Row */}
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <RecentIncidentsList />
          </StyledPaper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <IncidentDetails />
          </StyledPaper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StyledPaper2 sx={{ position: 'relative' }}>
            <IncidentImage />
          </StyledPaper2>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SafetyDashboard; 