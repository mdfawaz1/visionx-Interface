import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  Chip,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  Divider,
  Tooltip,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ShareIcon from '@mui/icons-material/Share';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import TimerIcon from '@mui/icons-material/Timer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import factoryWorkerImage from '../../../assets/fs.png';

const CardContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#f5f5f5',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover .image-overlay': {
    opacity: 1,
  },
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.9rem',
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(0.5),
    fontSize: '1.1rem'
  }
}));

const ViolationSection = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(244, 67, 54, 0.08)',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1.5),
  border: '1px solid rgba(244, 67, 54, 0.2)'
}));

const ActionSection = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(76, 175, 80, 0.08)',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1.5),
  border: '1px solid rgba(76, 175, 80, 0.2)',
  minHeight: '130px',
  overflowY: 'auto'
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: theme.spacing(1),
  width: '100%'
}));

const FullScreenImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '80vh',
  objectFit: 'contain',
});

const DetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(0.5),
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '1rem',
    color: theme.palette.text.secondary
  }
}));

const ActionItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(0.75),
  '& .number': {
    minWidth: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: theme.palette.success.main,
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  },
  '& .text': {
    flex: 1
  }
}));

const IncidentImage = () => {
  const [openFullscreen, setOpenFullscreen] = useState(false);

  const handleOpenFullscreen = () => {
    setOpenFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setOpenFullscreen(false);
  };

  return (
    <CardContainer elevation={0}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="700" color="primary">
          Incident Image
        </Typography>
        <Chip 
          icon={<PriorityHighIcon />} 
          label="Medium Priority" 
          color="warning"
          size="small"
        />
      </Box>
      
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {/* Left side - Image */}
        <Grid item xs={12} md={5} sx={{ height: { md: '350px' } }}>
          <ImageContainer>
            <Box
              component="img"
              src={factoryWorkerImage}
              alt="Factory worker without hairnet"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <ImageOverlay className="image-overlay">
              <IconButton 
                color="primary" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                }}
                onClick={handleOpenFullscreen}
              >
                <ZoomInIcon />
              </IconButton>
            </ImageOverlay>
          </ImageContainer>
        </Grid>
        
        {/* Right side - Content */}
        <Grid item xs={12} md={7}>
          <ContentContainer>
            <Box sx={{ mb: 1.5 }}>
              <DetailItem>
                <TimerIcon />
                <Typography variant="body2">Time: 10:30 AM</Typography>
              </DetailItem>
              <DetailItem>
                <LocationOnIcon />
                <Typography variant="body2">Location: Assembly Floor 2 Zone A</Typography>
              </DetailItem>
              <DetailItem>
                <EventIcon />
                <Typography variant="body2">Date: 2024-01-15</Typography>
              </DetailItem>
            </Box>
            
            <Divider sx={{ mb: 1.5 }} />
            
            <ViolationSection>
              <SectionTitle variant="subtitle2" color="error">
                <PriorityHighIcon /> 
                Violation Description
              </SectionTitle>
              <Typography variant="body2">
                Employee observed working without required hairnet in assembly area. This poses a contamination risk.
              </Typography>
            </ViolationSection>
            
            <ActionSection>
              <SectionTitle variant="subtitle2" color="success.main">
                Required Action
              </SectionTitle>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <ActionItem>
                  <Box className="number">1</Box>
                  <Typography variant="body2" className="text">
                    Immediate intervention
                  </Typography>
                </ActionItem>
                <ActionItem>
                  <Box className="number">2</Box>
                  <Typography variant="body2" className="text">
                    Provide hairnet and ensure proper usage
                  </Typography>
                </ActionItem>
                <ActionItem>
                  <Box className="number">3</Box>
                  <Typography variant="body2" className="text">
                    Schedule safety refresher training
                  </Typography>
                </ActionItem>
              </Box>
            </ActionSection>
          </ContentContainer>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 'auto', pt: 2 }}>
        <ButtonContainer>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<FileDownloadIcon />}
            size="small"
          >
            Full Report
          </Button>
          <Box>
            <Tooltip title="Share">
              <IconButton size="small" sx={{ mr: 1 }}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Button 
              variant="contained" 
              color="error"
              size="small"
            >
              Escalate Issue
            </Button>
          </Box>
        </ButtonContainer>
      </Box>
      
      <Dialog 
        open={openFullscreen} 
        onClose={handleCloseFullscreen}
        maxWidth="lg"
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleCloseFullscreen}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <FullScreenImage 
            src={factoryWorkerImage} 
            alt="Factory worker without hairnet" 
          />
        </DialogContent>
      </Dialog>
    </CardContainer>
  );
};

export default IncidentImage; 