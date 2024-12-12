import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { 
  FiFile, FiFolder, FiTag, FiGitBranch, FiInfo, 
  FiCpu, FiBox, FiLayers, FiActivity, FiAward, FiSettings,
  FiChevronRight, FiCheck, FiUpload, FiSliders, FiPlay, FiClock, FiX
} from 'react-icons/fi';

const primaryColor = '#0066FF';
const secondaryColor = '#FF2E93';
const gradientBg = 'linear-gradient(135deg, #0066FF, #6B37FF, #FF2E93)';
const softGradientBg = 'linear-gradient(135deg, rgba(0, 102, 255, 0.1), rgba(107, 55, 255, 0.1), rgba(255, 46, 147, 0.1))';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
    background: #f8fafc;
    color: #0F172A;
    min-height: 100vh;
  }
`;

const Container = styled(motion.div)`
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: -5.7rem;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  background: ${gradientBg};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
`;

const ModelsContainer = styled.div`
  width: 100%;
  padding: 2rem;
  background: #ffffff;
  border-radius: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${gradientBg};
    border-radius: 30px 30px 0 0;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: ${softGradientBg};
  border-radius: 15px;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  background: ${props => props.active ? gradientBg : 'transparent'};
  color: ${props => props.active ? '#fff' : '#64748B'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;

  &:hover {
    background: ${props => props.active ? gradientBg : 'rgba(0, 102, 255, 0.1)'};
  }

  svg {
    font-size: 1.2rem;
  }
`;

const ModelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
`;

const Badge = styled.span`
  background: ${props => props.type === 'custom' ? secondaryColor : primaryColor};
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  position: absolute;
  top: 1.4rem;
  right: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transform: translateY(-50%);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ModelCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem 1.5rem 1.5rem;
  cursor: pointer;
  border: 1px solid rgba(0, 102, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${softGradientBg};
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 102, 255, 0.1);
    border-color: ${primaryColor};

    &::before {
      opacity: 1;
    }

    > ${Badge} {
      background: ${gradientBg};
      transform: translateY(-50%) scale(1.05);
    }
  }
`;

const ModelName = styled.h3`
  margin: 0.5rem 0 1rem;
  color: #1E293B;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.3;
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 2rem;
    height: 3px;
    background: ${gradientBg};
    border-radius: 2px;
  }
`;

const ModelDetails = styled.div`
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  position: relative;
  z-index: 1;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 102, 255, 0.05);
  }

  svg {
    color: ${primaryColor};
    min-width: 16px;
  }

  span {
    color: #1E293B;
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 102, 255, 0.1);
  border-radius: 50%;
  border-top-color: ${primaryColor};
  animation: spin 1s linear infinite;
  margin: 2rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled(motion.div)`
  color: ${secondaryColor};
  background: rgba(255, 46, 147, 0.1);
  padding: 1rem 2rem;
  border-radius: 10px;
  margin: 1rem 0;
  text-align: center;
  border: 1px solid rgba(255, 46, 147, 0.3);
  max-width: 600px;
  width: 100%;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748B;
  font-size: 1.1rem;
  background: ${softGradientBg};
  border-radius: 10px;
  border: 1px dashed rgba(0, 102, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  svg {
    color: ${primaryColor};
  }

  p {
    margin: 0;
    color: #1E293B;
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 102, 255, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: ${primaryColor};
  margin-top: 1rem;
  width: fit-content;
  border: 1px solid rgba(0, 102, 255, 0.2);

  svg {
    font-size: 1.1rem;
    color: ${primaryColor};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: auto;
`;

const StatItem = styled.div`
  background: ${props => props.highlight ? primaryColor : 'rgba(0, 102, 255, 0.05)'};
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.highlight ? 'transparent' : 'rgba(0, 102, 255, 0.1)'};

  svg {
    color: ${props => props.highlight ? 'white' : primaryColor};
    font-size: 1.2rem;
  }

  span {
    color: ${props => props.highlight ? 'white' : '#1E293B'};
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
  }

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.highlight ? primaryColor : 'white'};
    border-color: ${primaryColor};
    box-shadow: 0 4px 12px rgba(0, 102, 255, 0.1);
  }
`;

const Description = styled.p`
  color: #64748B;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  position: relative;
  z-index: 1;
`;

const TrainingSetup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const TrainingPanel = styled(motion.div)`
  background: white;
  border-radius: 30px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${gradientBg};
    border-radius: 30px 30px 0 0;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${primaryColor};
    border-radius: 4px;
  }
`;

const TrainingHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  background: white;
  z-index: 2;

  h2 {
    color: #1E293B;
    font-size: 1.8rem;
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 1rem;

    svg {
      color: ${primaryColor};
    }
  }
`;

const StepIndicator = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
`;

const Step = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active ? gradientBg : softGradientBg};
  color: ${props => props.active ? 'white' : primaryColor};
  font-weight: 600;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -1rem;
    width: 1rem;
    height: 2px;
    background: ${props => props.completed ? primaryColor : '#e2e8f0'};
  }
`;

const TrainingContent = styled.div`
  padding: 2rem;
`;

const TrainingForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #1E293B;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${primaryColor};
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: ${primaryColor};
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
  }
`;

const ActionButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  background: ${props => props.secondary ? 'transparent' : gradientBg};
  color: ${props => props.secondary ? '#64748B' : 'white'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.secondary ? 'none' : '0 10px 20px rgba(0, 102, 255, 0.1)'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const FileStatItem = styled(StatItem)`
  background: ${primaryColor};
  color: white;
  
  svg {
    color: white;
  }

  span {
    color: white;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const DatasetSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: ${softGradientBg};
  border-radius: 15px;
  border: 1px dashed rgba(0, 102, 255, 0.3);
`;

const DatasetUploadBox = styled.div`
  border: 2px dashed ${primaryColor};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 102, 255, 0.02);
    border-color: ${secondaryColor};
  }

  .upload-icon {
    font-size: 2.5rem;
    color: ${primaryColor};
    margin-bottom: 1rem;
  }

  h3 {
    color: #1E293B;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #64748B;
    margin: 0;
    font-size: 0.9rem;
  }

  .file-types {
    margin-top: 1rem;
    font-size: 0.8rem;
    color: #94A3B8;
  }
`;

const DatasetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(0, 102, 255, 0.2);

  svg {
    color: ${primaryColor};
    font-size: 1.2rem;
  }
`;

const ModelDescription = styled.p`
  color: #64748B;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0.5rem 0;
  position: relative;
  z-index: 1;
`;

const VersionDetails = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: ${softGradientBg};
  border-radius: 12px;
  border: 1px solid rgba(0, 102, 255, 0.1);
`;

const VersionInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const InfoItem = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 102, 255, 0.1);
  
  .label {
    color: #64748B;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }
  
  .value {
    color: #1E293B;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: ${primaryColor};
    }
  }
`;

function TrainModel() {
  const [pretrainedModels, setPretrainedModels] = useState([]);
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pretrained');
  const [selectedModel, setSelectedModel] = useState(null);
  const [trainingSetup, setTrainingSetup] = useState({
    visible: false,
    step: 1,
    config: {
      epochs: 50,
      batchSize: 16,
      learningRate: 0.001,
      datasetPath: '',
      modelVersion: '',
    }
  });
  const [selectedVersionDetails, setSelectedVersionDetails] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const [pretrainedResponse, customResponse] = await Promise.all([
          api.get('/models'),
          api.get('/custom-models')
        ]);

        setPretrainedModels(pretrainedResponse.data);
        setCustomModels(customResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch models. Please try again later.');
        console.error('Error fetching models:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleModelSelect = (model, type) => {
    handleStartTraining(model);
  };

  const getFileName = (path) => {
    if (!path) return '';
    return path.split('/').pop();
  };

  const handleStartTraining = (model) => {
    setSelectedModel(model);
    setTrainingSetup(prev => ({
      ...prev,
      visible: true,
      step: 1
    }));
  };

  const handleCloseTraining = () => {
    setTrainingSetup(prev => ({
      ...prev,
      visible: false,
      step: 1
    }));
    setSelectedModel(null);
  };

  const handleTrainingSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post('/model/train', {
        modelType: selectedModel?.versions ? 'custom' : 'pretrained',
        modelName: selectedModel?.name,
        modelVersion: trainingSetup.config.modelVersion,
        dataPath: trainingSetup.config.datasetPath,
        epochs: trainingSetup.config.epochs,
        batchSize: trainingSetup.config.batchSize,
        learningRate: trainingSetup.config.learningRate
      });

      setError(null);
      alert('Training started successfully!');
      handleCloseTraining();
    } catch (err) {
      setError('Failed to start training. Please try again.');
      console.error('Error starting training:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVersionDetails = async (modelName, version) => {
    try {
      const response = await api.get(`/custom-model/${modelName}`);
      const modelData = response.data;
      
      const versionDetails = modelData.versions.find(v => v.version === version);
      if (versionDetails) {
        setSelectedVersionDetails({
          version: versionDetails.version,
          filePath: versionDetails.CustomModelfilePath,
          createdAt: versionDetails.createdAt,
          _id: versionDetails._id
        });
      }
    } catch (error) {
      console.error('Error fetching version details:', error);
      setError('Failed to fetch version details');
    }
  };

  const handleVersionSelect = async (modelName, version) => {
    setTrainingSetup(prev => ({
      ...prev,
      config: { ...prev.config, modelVersion: version }
    }));
    
    if (version) {
      try {
        await fetchVersionDetails(modelName, version);
      } catch (error) {
        console.error('Error handling version selection:', error);
        setError('Failed to fetch version details');
      }
    } else {
      setSelectedVersionDetails(null);
    }
  };

  useEffect(() => {
    setSelectedVersionDetails(null);
  }, [selectedModel]);

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Model Training Dashboard</Title>

        <ModelsContainer>
          <TabContainer>
            <Tab 
              active={activeTab === 'pretrained'} 
              onClick={() => setActiveTab('pretrained')}
            >
              <FiCpu />
              Pre-trained Models
            </Tab>
            <Tab 
              active={activeTab === 'custom'} 
              onClick={() => setActiveTab('custom')}
            >
              <FiBox />
              Custom Models
            </Tab>
          </TabContainer>

          <AnimatePresence mode="wait">
            <ModelGrid>
              {activeTab === 'pretrained' ? (
                pretrainedModels.length > 0 ? (
                  pretrainedModels.map(model => (
                    <ModelCard
                      key={model._id}
                      onClick={() => handleStartTraining(model)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Badge type="pretrained">Pre-trained</Badge>
                      <ModelName>{model.name}</ModelName>
                      
                      <ModelDescription>
                        {model.useCase || 'A powerful pre-trained model for advanced computer vision tasks.'}
                      </ModelDescription>

                      <StatsContainer>
                        <StatItem highlight>
                          <FiFile />
                          <span>{getFileName(model.modelFilePath)}</span>
                        </StatItem>
                        <StatItem>
                          <FiActivity />
                          <span>Fast Inference</span>
                        </StatItem>
                        <StatItem>
                          <FiLayers />
                          <span>Optimized</span>
                        </StatItem>
                        <StatItem>
                          <FiAward />
                          <span>95% Accuracy</span>
                        </StatItem>
                      </StatsContainer>
                    </ModelCard>
                  ))
                ) : (
                  <EmptyState>
                    <FiFolder size={24} />
                    <p>No pre-trained models available</p>
                  </EmptyState>
                )
              ) : (
                customModels.length > 0 ? (
                  customModels.map(model => (
                    <ModelCard
                      key={model._id}
                      onClick={() => handleStartTraining(model)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Badge type="custom">Custom</Badge>
                      <ModelName>{model.name}</ModelName>
                      
                      <ModelDescription>
                        {model.useCase || 'Custom trained model for specific use cases.'}
                      </ModelDescription>

                      <StatsContainer>
                        <StatItem highlight>
                          <FiGitBranch />
                          <span>Version {model.currentVersion || '1.0'}</span>
                        </StatItem>
                        <StatItem>
                          <FiInfo />
                          <span>{model.versions?.length || 0} Versions</span>
                        </StatItem>
                        <StatItem>
                          <FiActivity />
                          <span>Custom Trained</span>
                        </StatItem>
                        <StatItem>
                          <FiLayers />
                          <span>Specialized</span>
                        </StatItem>
                      </StatsContainer>
                    </ModelCard>
                  ))
                ) : (
                  <EmptyState>
                    <FiFolder size={24} />
                    <p>No custom models available</p>
                  </EmptyState>
                )
              )}
            </ModelGrid>
          </AnimatePresence>
        </ModelsContainer>
      </Container>
      {trainingSetup.visible && (
        <TrainingSetup
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <TrainingPanel
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <TrainingHeader>
              <div>
                <h2>{selectedModel?.name}</h2>
                <StepIndicator>
                  {[1, 2, 3].map(step => (
                    <Step 
                      key={step}
                      active={trainingSetup.step === step}
                      completed={trainingSetup.step > step}
                    >
                      {step}
                    </Step>
                  ))}
                </StepIndicator>
              </div>
              <ActionButton secondary onClick={handleCloseTraining}>
                Cancel
              </ActionButton>
            </TrainingHeader>

            <TrainingContent>
              {trainingSetup.step === 1 && (
                <TrainingForm>
                  {selectedModel?.versions ? (
                    <>
                      <FormGroup>
                        <Label>Model Version</Label>
                        <Select
                          value={trainingSetup.config.modelVersion}
                          onChange={(e) => handleVersionSelect(selectedModel.name, e.target.value)}
                        >
                          <option value="">Select Version</option>
                          {selectedModel.versions.map(version => (
                            <option key={version.version} value={version.version}>
                              Version {version.version}
                            </option>
                          ))}
                        </Select>
                      </FormGroup>

                      {trainingSetup.config.modelVersion && !selectedVersionDetails && (
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                          <LoadingSpinner />
                        </div>
                      )}

                      {selectedVersionDetails && (
                        <VersionDetails>
                          <Label>Version Details</Label>
                          <VersionInfo>
                            <InfoItem>
                              <div className="label">Model File</div>
                              <div className="value">
                                <FiFile />
                                {getFileName(selectedVersionDetails.filePath)}
                              </div>
                            </InfoItem>
                            <InfoItem>
                              <div className="label">Version</div>
                              <div className="value">
                                <FiGitBranch />
                                {selectedVersionDetails.version}
                              </div>
                            </InfoItem>
                            <InfoItem>
                              <div className="label">Created At</div>
                              <div className="value">
                                <FiClock />
                                {new Date(selectedVersionDetails.createdAt).toLocaleDateString()}
                              </div>
                            </InfoItem>
                            <InfoItem>
                              <div className="label">Status</div>
                              <div className="value">
                                <FiCheck style={{ color: '#10B981' }} />
                                Ready for Training
                              </div>
                            </InfoItem>
                          </VersionInfo>
                        </VersionDetails>
                      )}
                    </>
                  ) : (
                    <FormGroup>
                      <Label>Selected Model File</Label>
                      <DatasetInfo>
                        <FiFile />
                        <div>
                          <strong>{getFileName(selectedModel?.modelFilePath)}</strong>
                          <p style={{ color: '#64748B', margin: '0.5rem 0 0 0' }}>
                            Pre-trained model ready for training
                          </p>
                        </div>
                      </DatasetInfo>
                    </FormGroup>
                  )}
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <ActionButton
                      secondary
                      onClick={handleCloseTraining}
                    >
                      <FiX /> Cancel
                    </ActionButton>
                    <ActionButton
                      onClick={() => setTrainingSetup(prev => ({ ...prev, step: 2 }))}
                      disabled={selectedModel?.versions && !trainingSetup.config.modelVersion}
                    >
                      Next <FiChevronRight />
                    </ActionButton>
                  </div>
                </TrainingForm>
              )}

              {trainingSetup.step === 2 && (
                <TrainingForm>
                  <DatasetSection>
                    <Label>Dataset Configuration</Label>
                    <DatasetUploadBox
                      onClick={() => document.getElementById('datasetInput').click()}
                    >
                      <FiUpload className="upload-icon" />
                      <h3>Upload Dataset</h3>
                      <p>Click to browse or drag and drop your dataset zip file</p>
                      <div className="file-types">Supported format: .zip</div>
                      <input
                        id="datasetInput"
                        type="file"
                        accept=".zip"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
                              // Create FormData and append file
                              const formData = new FormData();
                              formData.append('dataset', file);

                              // Upload the zip file
                              api.post('/upload/dataset', formData, {
                                headers: {
                                  'Content-Type': 'multipart/form-data'
                                }
                              })
                              .then(response => {
                                setTrainingSetup(prev => ({
                                  ...prev,
                                  config: { 
                                    ...prev.config, 
                                    datasetPath: response.data.path 
                                  }
                                }));
                              })
                              .catch(error => {
                                setError('Failed to upload dataset. Please try again.');
                                console.error('Upload error:', error);
                              });
                            } else {
                              setError('Please upload a zip file');
                            }
                          }
                        }}
                      />
                    </DatasetUploadBox>

                    {trainingSetup.config.datasetPath && (
                      <DatasetInfo>
                        <FiFile />
                        <div>
                          <strong>Dataset Uploaded</strong>
                          <p style={{ 
                            color: '#64748B', 
                            margin: '0.5rem 0 0 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem' 
                          }}>
                            <FiCheck style={{ color: '#10B981' }} />
                            Ready for training
                          </p>
                        </div>
                        <ActionButton 
                          secondary 
                          style={{ marginLeft: 'auto' }}
                          onClick={() => setTrainingSetup(prev => ({
                            ...prev,
                            config: { ...prev.config, datasetPath: '' }
                          }))}
                        >
                          <FiX /> Remove
                        </ActionButton>
                      </DatasetInfo>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                      <ActionButton
                        secondary
                        onClick={() => setTrainingSetup(prev => ({ ...prev, step: 1 }))}
                      >
                        <FiChevronRight style={{ transform: 'rotate(180deg)' }} /> Back
                      </ActionButton>
                      <ActionButton
                        onClick={() => setTrainingSetup(prev => ({ ...prev, step: 3 }))}
                        disabled={!trainingSetup.config.datasetPath}
                      >
                        Next <FiChevronRight />
                      </ActionButton>
                    </div>
                  </DatasetSection>
                </TrainingForm>
              )}

              {trainingSetup.step === 3 && (
                <TrainingForm onSubmit={handleTrainingSubmit}>
                  <FormGroup>
                    <Label>Number of Epochs</Label>
                    <Input
                      type="number"
                      value={trainingSetup.config.epochs}
                      onChange={(e) => setTrainingSetup(prev => ({
                        ...prev,
                        config: { ...prev.config, epochs: parseInt(e.target.value) }
                      }))}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Batch Size</Label>
                    <Input
                      type="number"
                      value={trainingSetup.config.batchSize}
                      onChange={(e) => setTrainingSetup(prev => ({
                        ...prev,
                        config: { ...prev.config, batchSize: parseInt(e.target.value) }
                      }))}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Learning Rate</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={trainingSetup.config.learningRate}
                      onChange={(e) => setTrainingSetup(prev => ({
                        ...prev,
                        config: { ...prev.config, learningRate: parseFloat(e.target.value) }
                      }))}
                    />
                  </FormGroup>
                  <ActionButton type="submit">
                    Start Training <FiPlay />
                  </ActionButton>
                </TrainingForm>
              )}
            </TrainingContent>
          </TrainingPanel>
        </TrainingSetup>
      )}
    </>
  );
}

export default TrainModel;