import React from 'react';
import { Box, Typography, Divider, Chip, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const IncidentContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
}));

const ScrollableContainer = styled(Box)(({ theme }) => ({
  maxHeight: '535px',
  overflowY: 'auto',
  paddingRight: theme.spacing(1),
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.3)',
    },
  },
}));

const IncidentItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 0),
}));

const IconChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 4,
  fontWeight: 500,
  padding: theme.spacing(0, 0.5),
}));

// Custom styling for different chip types
const getChipStyle = (type) => {
  switch(type) {
    case 'hairnet':
      return { backgroundColor: 'rgba(64, 115, 230, 0.1)', color: '#4073E6' };
    case 'gloves':
      return { backgroundColor: 'rgba(90, 97, 187, 0.1)', color: '#5A61BB' };
    case 'mask':
      return { backgroundColor: 'rgba(101, 84, 192, 0.1)', color: '#6554C0' };
    case 'shoes':
      return { backgroundColor: 'rgba(87, 167, 115, 0.1)', color: '#57A773' };
    case 'apron':
      return { backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#FF9800' };
    case 'goggles':
      return { backgroundColor: 'rgba(233, 30, 99, 0.1)', color: '#E91E63' };
    case 'earplugs':
      return { backgroundColor: 'rgba(156, 39, 176, 0.1)', color: '#9C27B0' };
    case 'helmet':
      return { backgroundColor: 'rgba(0, 150, 136, 0.1)', color: '#009688' };
    default:
      return { backgroundColor: 'rgba(100, 100, 100, 0.1)', color: '#646464' };
  }
};

// Expanded list of incidents with more variety
const incidents = [
  { 
    id: 1, 
    title: 'No Hairnet', 
    date: '2024-01-15', 
    type: 'hairnet',
    location: 'Assembly Line A'
  },
  { 
    id: 2, 
    title: 'Missing Safety Gloves', 
    date: '2024-01-14', 
    type: 'gloves',
    location: 'Packaging Area'
  },
  { 
    id: 3, 
    title: 'No Safety Mask', 
    date: '2024-01-13', 
    type: 'mask',
    location: 'Chemical Processing'
  },
  { 
    id: 4, 
    title: 'Missing Safety Shoes', 
    date: '2024-01-12', 
    type: 'shoes',
    location: 'Loading Dock'
  },
  { 
    id: 5, 
    title: 'No Hairnet', 
    date: '2024-01-11', 
    type: 'hairnet',
    location: 'Sterile Packaging'
  },
  { 
    id: 6, 
    title: 'Missing Protective Goggles', 
    date: '2024-01-10', 
    type: 'goggles',
    location: 'Welding Station'
  },
  { 
    id: 7, 
    title: 'No Safety Apron', 
    date: '2024-01-09', 
    type: 'apron',
    location: 'Food Processing'
  },
  { 
    id: 8, 
    title: 'Missing Ear Protection', 
    date: '2024-01-08', 
    type: 'earplugs',
    location: 'Machine Shop'
  },
  { 
    id: 9, 
    title: 'No Hard Hat', 
    date: '2024-01-07', 
    type: 'helmet',
    location: 'Construction Area'
  },
  { 
    id: 10, 
    title: 'Missing Safety Gloves', 
    date: '2024-01-06', 
    type: 'gloves',
    location: 'Maintenance'
  },
  { 
    id: 11, 
    title: 'No Safety Mask', 
    date: '2024-01-05', 
    type: 'mask',
    location: 'Paint Shop'
  },
  { 
    id: 12, 
    title: 'Missing Safety Shoes', 
    date: '2024-01-04', 
    type: 'shoes',
    location: 'Warehouse'
  }
];

const getIcon = (type) => {
  switch(type) {
    case 'hairnet': return 'Hairnet';
    case 'gloves': return 'Gloves';
    case 'mask': return 'Mask';
    case 'shoes': return 'Shoes';
    case 'apron': return 'Apron';
    case 'goggles': return 'Goggles';
    case 'earplugs': return 'Ear Prot.';
    case 'helmet': return 'Helmet';
    default: return '';
  }
};

const RecentIncidentsList = () => {
  return (
    <IncidentContainer elevation={0}>
      <Typography variant="h5" fontWeight="700" color="primary" mb={3}>
        Recent Incidents
      </Typography>
      
      <ScrollableContainer>
        {incidents.map((incident, index) => (
          <React.Fragment key={incident.id}>
            <IncidentItem>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="600">
                  {incident.title}
                </Typography>
                <IconChip 
                  label={getIcon(incident.type)} 
                  size="small"
                  variant="filled"
                  sx={getChipStyle(incident.type)}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {incident.date}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                Location: {incident.location}
              </Typography>
            </IncidentItem>
            {index < incidents.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </ScrollableContainer>
    </IncidentContainer>
  );
};

export default RecentIncidentsList; 