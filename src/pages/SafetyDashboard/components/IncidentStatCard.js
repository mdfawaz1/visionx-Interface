import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { styled } from '@mui/material/styles';

const StatPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#fff',
}));

const ValueChangeBox = styled(Box)(({ theme, isPositive }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px 8px',
  borderRadius: '18px',
  backgroundColor: isPositive ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  color: isPositive ? theme.palette.success.main : theme.palette.error.main,
  width: 'fit-content',
}));

const StatusBar = styled(Box)(({ theme, status }) => ({
  width: '100%',
  height: '4px',
  backgroundColor: status === 'Alert' ? theme.palette.error.main : theme.palette.success.main,
  marginTop: 'auto',
}));

const StatusText = styled(Typography)(({ theme, status }) => ({
  fontSize: '0.75rem',
  color: status === 'Alert' ? theme.palette.error.main : theme.palette.success.main,
  fontWeight: 500,
  textAlign: 'center',
  marginTop: 'auto',
  marginBottom: theme.spacing(0.5),
}));

const StatusLine = styled(Box)(({ theme, status }) => ({
  width: '30%',
  height: '2px',
  backgroundColor: status === 'Alert' ? theme.palette.error.main : theme.palette.success.main,
  marginBottom: theme.spacing(0.5),
  marginLeft: '10px'
}));

const IncidentStatCard = ({ 
  title, 
  value, 
  comparison, 
  change, 
  isPositive, 
  icon, 
  status 
}) => {
  return (
<StatPaper elevation={1}> 
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="subtitle1" color="textSecondary" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Box sx={{ fontSize: '1.2rem' }}>{icon}</Box>
      </Box>
      
      <Typography variant="h4" component="div" sx={{ 
        fontWeight: 700, 
        color: '#1a237e',
        lineHeight: 1.2,
        my: 1
      }}>
        {value}
      </Typography>
      
      <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
        {comparison}
      </Typography>
      
      <ValueChangeBox isPositive={isPositive}>
        {isPositive ? 
          <ArrowDownwardIcon fontSize="small" sx={{ fontSize: '0.875rem', mr: 0.5 }} /> : 
          <ArrowUpwardIcon fontSize="small" sx={{ fontSize: '0.875rem', mr: 0.5 }} />
        }
        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
          {change}
        </Typography>
      </ValueChangeBox>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 'auto' }}>
        <StatusLine status={status} />
        <StatusText status={status} variant="caption">
          {status}
        </StatusText>
      </Box>
      
      <StatusBar status={status} />
    </StatPaper>
  );
};

export default IncidentStatCard; 