// src/MainRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ModelsList from './pages/Models/ModelsList';
import RunScript from './pages/RunScript';
import TrainModel from './pages/TrainModel';
import CustomModelsList from './pages/CustomModels/CustomModelsList';
import CustomModelDetails from './pages/CustomModels/CustomModelDetails';
import InferCustomModelVideo from './pages/InferVideo/InferCustomModelVideo';
import InferPretrainedModelVideo from './pages/InferVideo/InferPretrainedModelVideo';
import LiveMonitor from './pages/LiveMonitor';
function MainRoutes() {
  return (
    <main style={{ paddingLeft: 240, paddingTop: 64 }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/models" element={<ModelsList />} />
        <Route path="/run-script" element={<RunScript />} />
        <Route path="/train-model" element={<TrainModel />} />
        <Route path="/custom-models" element={<CustomModelsList />} />
        <Route path="/custom-models/:modelName" element={<CustomModelDetails />} />
        <Route path="/infer-video" element={<InferPretrainedModelVideo />} />
        <Route path="/infer-custom-video" element={<InferCustomModelVideo />} />
        <Route path="/live-monitor" element={<LiveMonitor />} />
        
        {/* Add any other routes */}
      </Routes>
    </main>
  );
}

export default MainRoutes;