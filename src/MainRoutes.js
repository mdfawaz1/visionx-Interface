// src/MainRoutes.js
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

// Protected Route component
const ProtectedRoute = ({ children, isAdmin }) => {
  const userRole = localStorage.getItem('userRole');
  
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAdmin && userRole !== 'admin') {
    return <Navigate to="/live-monitor" replace />;
  }
  
  return children || <Outlet />;
};

function MainRoutes() {
  return (
    <main style={{ paddingLeft: 0, paddingTop: 64 }}>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected User Route */}
        <Route 
          path="/live-monitor" 
          element={
            <ProtectedRoute>
              <LiveMonitor />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route path="/" element={<ProtectedRoute isAdmin={true}><Outlet /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="models" element={<ModelsList />} />
          <Route path="run-script" element={<RunScript />} />
          <Route path="train-model" element={<TrainModel />} />
          <Route path="custom-models" element={<CustomModelsList />} />
          <Route path="custom-models/:modelName" element={<CustomModelDetails />} />
          <Route path="infer-video" element={<InferPretrainedModelVideo />} />
          <Route path="infer-custom-video" element={<InferCustomModelVideo />} />
          <Route path="forecasting" element={<Forecasting />} />
        </Route>

        {/* Redirect unauthenticated users to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </main>
  );
}

export default MainRoutes;