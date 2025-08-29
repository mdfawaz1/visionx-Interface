// src/MainRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ModelsList from './pages/Models/ModelsList';
import RunScript from './pages/RunScript';
import TrainModel from './pages/TrainModel';
import CustomModelsList from './pages/CustomModels/CustomModelsList';
import CustomModelDetails from './pages/CustomModels/CustomModelDetails';
import InferCustomModelVideo from './pages/InferVideo/InferCustomModelVideo';
import InferPretrainedModelVideo from './pages/InferVideo/InferPretrainedModelVideo';
import LiveMonitor from './pages/LiveMonitor';
import Forecasting from './pages/Forecasting/Forecasting';
import Login from './pages/Login';
import DeviceManagement from './pages/DeviceManagement/DeviceManagement';
import LogViewer from './pages/LogViewer/LogViewer';
import Guide from './pages/Guide';
import SafetyDashboard from './pages/SafetyDashboard/SafetyDashboard';
import UserManagement from './pages/UserManagement/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';

function MainRoutes() {
  return (
    <main style={{ paddingLeft: 0, paddingTop: 64 }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/guide" element={<Guide />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        
        {/* Model Management Routes */}
        <Route 
          path="/models" 
          element={
            <ProtectedRoute requiredPage="models">
              <ModelsList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/custom-models" 
          element={
            <ProtectedRoute requiredPermission="canAccessCustomModels">
              <CustomModelsList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/custom-models/:modelName" 
          element={
            <ProtectedRoute requiredPermission="canAccessCustomModels">
              <CustomModelDetails />
            </ProtectedRoute>
          } 
        />
        
        {/* Training and Inference Routes */}
        <Route 
          path="/train-model" 
          element={
            <ProtectedRoute requiredPage="training">
              <TrainModel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/infer-video" 
          element={
            <ProtectedRoute requiredPage="models">
              <InferPretrainedModelVideo />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/infer-custom-video" 
          element={
            <ProtectedRoute requiredPermission="canAccessCustomModels">
              <InferCustomModelVideo />
            </ProtectedRoute>
          } 
        />
        
        {/* Monitoring and Analytics Routes */}
        <Route 
          path="/live-monitor" 
          element={
            <ProtectedRoute requiredPage="monitoring">
              <LiveMonitor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/run-script" 
          element={
            <ProtectedRoute requiredPage="monitoring">
              <RunScript />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/safety-dashboard" 
          element={
            <ProtectedRoute requiredPage="incidents">
              <SafetyDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Device Management Routes */}
        <Route 
          path="/device-management" 
          element={
            <ProtectedRoute requiredPage="devices">
              <DeviceManagement />
            </ProtectedRoute>
          } 
        />
        
        {/* Forecasting Routes */}
        <Route 
          path="/forecasting" 
          element={
            <ProtectedRoute requiredPage="forecasting">
              <Forecasting />
            </ProtectedRoute>
          } 
        />
        
        {/* System Routes */}
        <Route 
          path="/log-viewer" 
          element={
            <ProtectedRoute requiredPage="logs">
              <LogViewer />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/user-management" 
          element={
            <ProtectedRoute requiredPermission="canManageUsers">
              <UserManagement />
            </ProtectedRoute>
          } 
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

export default MainRoutes;