import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Chip, 
  Paper,
  Button,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarningIcon from '@mui/icons-material/Warning';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const DetailContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
  height: '100%'
}));

const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1.5, 0),
  alignItems: 'center',
}));

const LabelColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '40%',
  color: theme.palette.text.secondary,
}));

const ValueColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '60%',
  fontWeight: 500,
}));

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(3),
}));

// Severity levels with colors
const severityLevels = [
  { value: 1, label: 'Low', color: 'success' },
  { value: 2, label: 'Medium-Low', color: 'info' },
  { value: 3, label: 'Medium', color: 'warning' },
  { value: 4, label: 'High', color: 'error' },
  { value: 5, label: 'Critical', color: 'error' },
];

// Status options
const statusOptions = [
  { value: 'open', label: 'Open', color: 'error' },
  { value: 'investigating', label: 'Investigating', color: 'warning' },
  { value: 'resolved', label: 'Resolved', color: 'success' },
  { value: 'closed', label: 'Closed', color: 'default' },
];

const IncidentDetails = () => {
  const [editing, setEditing] = useState(false);
  const [incidentData, setIncidentData] = useState({
    id: 'TY134DT',
    date: '2024-01-15',
    type: 'No Hairnet',
    location: 'Assembly Floor 2 Zone A',
    severity: 3,
    status: 'open',
    assignedTo: 'Sarah Johnson',
    reportedBy: 'Michael Chen',
    dueDate: '2024-01-22',
    notes: 'Employee was observed without a hairnet in the food processing area. This is a violation of safety protocol section 3.2.1.'
  });

  const [tempData, setTempData] = useState({...incidentData});

  const handleEdit = () => {
    setTempData({...incidentData});
    setEditing(true);
  };

  const handleSave = () => {
    setIncidentData({...tempData});
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleChange = (field) => (event) => {
    setTempData({
      ...tempData,
      [field]: event.target.value
    });
  };

  return (
    <DetailContainer elevation={0}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="700" color="primary">
          Incident Details
        </Typography>
        {!editing ? (
          <IconButton color="primary" onClick={handleEdit} size="small">
            <EditIcon />
          </IconButton>
        ) : (
          <Box>
            <IconButton color="success" onClick={handleSave} size="small" sx={{ mr: 1 }}>
              <CheckCircleIcon />
            </IconButton>
            <IconButton color="error" onClick={handleCancel} size="small">
              <CancelIcon />
            </IconButton>
          </Box>
        )}
      </Box>

      <DetailRow>
        <LabelColumn>
          <AssignmentIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2">Incident ID:</Typography>
        </LabelColumn>
        <ValueColumn>
          <Typography variant="body1" fontWeight="600">
            {incidentData.id}
          </Typography>
        </ValueColumn>
      </DetailRow>
      <Divider />
      
      <DetailRow>
        <LabelColumn>
          <EventIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2">Date:</Typography>
        </LabelColumn>
        <ValueColumn>
          {!editing ? (
            <Typography variant="body1">{incidentData.date}</Typography>
          ) : (
            <TextField
              value={tempData.date}
              onChange={handleChange('date')}
              variant="outlined"
              size="small"
              type="date"
              fullWidth
            />
          )}
        </ValueColumn>
      </DetailRow>
      <Divider />
      
      <DetailRow>
        <LabelColumn>
          <WarningIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2">Incident Type:</Typography>
        </LabelColumn>
        <ValueColumn>
          {!editing ? (
            <Typography variant="body1" color="error.main">{incidentData.type}</Typography>
          ) : (
            <FormControl fullWidth size="small">
              <Select
                value={tempData.type}
                onChange={handleChange('type')}
              >
                <MenuItem value="No Hairnet">No Hairnet</MenuItem>
                <MenuItem value="Missing Safety Gloves">Missing Safety Gloves</MenuItem>
                <MenuItem value="No Safety Mask">No Safety Mask</MenuItem>
                <MenuItem value="Missing Safety Shoes">Missing Safety Shoes</MenuItem>
                <MenuItem value="No Safety Apron">No Safety Apron</MenuItem>
                <MenuItem value="Missing Protective Goggles">Missing Protective Goggles</MenuItem>
              </Select>
            </FormControl>
          )}
        </ValueColumn>
      </DetailRow>
      <Divider />
      
      <DetailRow>
        <LabelColumn>
          <LocationOnIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2">Location:</Typography>
        </LabelColumn>
        <ValueColumn>
          {!editing ? (
            <Typography 
              variant="body1" 
              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            >
              {incidentData.location}
            </Typography>
          ) : (
            <TextField
              value={tempData.location}
              onChange={handleChange('location')}
              variant="outlined"
              size="small"
              fullWidth
            />
          )}
        </ValueColumn>
      </DetailRow>
      <Divider />
      
      <DetailRow>
        <LabelColumn>
          <WarningIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2">Severity:</Typography>
        </LabelColumn>
        <ValueColumn>
          {!editing ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                {incidentData.severity}
              </Typography>
              <Chip 
                size="small" 
                label={severityLevels.find(s => s.value === incidentData.severity)?.label} 
                color={severityLevels.find(s => s.value === incidentData.severity)?.color} 
              />
            </Box>
          ) : (
            <FormControl fullWidth size="small">
              <Select
                value={tempData.severity}
                onChange={handleChange('severity')}
              >
                {severityLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.value} - {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </ValueColumn>
      </DetailRow>
      <Divider />
      
      <DetailRow>
        <LabelColumn>
          <Typography variant="subtitle2">Status:</Typography>
        </LabelColumn>
        <ValueColumn>
          {!editing ? (
            <Chip 
              size="small" 
              label={statusOptions.find(s => s.value === incidentData.status)?.label}
              color={statusOptions.find(s => s.value === incidentData.status)?.color}
            />
          ) : (
            <FormControl fullWidth size="small">
              <Select
                value={tempData.status}
                onChange={handleChange('status')}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </ValueColumn>
      </DetailRow>
      <Divider />
      
      <DetailRow>
        <LabelColumn>
          <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2">Assigned To:</Typography>
        </LabelColumn>
        <ValueColumn>
          {!editing ? (
            <Typography variant="body1">{incidentData.assignedTo}</Typography>
          ) : (
            <TextField
              value={tempData.assignedTo}
              onChange={handleChange('assignedTo')}
              variant="outlined"
              size="small"
              fullWidth
            />
          )}
        </ValueColumn>
      </DetailRow>
      <Divider />
      
      <DetailRow>
        <LabelColumn>
          <CalendarTodayIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2">Due Date:</Typography>
        </LabelColumn>
        <ValueColumn>
          {!editing ? (
            <Typography variant="body1">{incidentData.dueDate}</Typography>
          ) : (
            <TextField
              value={tempData.dueDate}
              onChange={handleChange('dueDate')}
              variant="outlined"
              size="small"
              type="date"
              fullWidth
            />
          )}
        </ValueColumn>
      </DetailRow>
      <Divider />
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Notes:
        </Typography>
        {!editing ? (
          <Typography variant="body2" sx={{ fontSize: '0.9rem', mt: 1 }}>
            {incidentData.notes}
          </Typography>
        ) : (
          <TextField
            value={tempData.notes}
            onChange={handleChange('notes')}
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            size="small"
          />
        )}
      </Box>
      
      {!editing && (
        <ActionButtonsContainer>
          <Button variant="outlined" size="small" color="primary">
            View History
          </Button>
          <Button variant="contained" size="small" color="primary">
            Update Status
          </Button>
        </ActionButtonsContainer>
      )}
    </DetailContainer>
  );
};

export default IncidentDetails; 