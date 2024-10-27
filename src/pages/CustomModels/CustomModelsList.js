// src/pages/CustomModels/CustomModelsList.js
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, CardActions, Button, Dialog,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddCustomModel from './AddCustomModel';
const api = axios.create({
  baseURL: 'http://localhost:26000/api/v1',
});


function CustomModelsList() {
  const [models, setModels] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    api.get('/custom-models')
      .then(response => setModels(response.data))
      .catch(error => console.error('Error fetching custom models:', error));
  }, []);

  const handleAddModel = (newModel) => {
    setModels(prevModels => [...prevModels, newModel]);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Custom Models
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>
        Add Custom Model
      </Button>
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <AddCustomModel onClose={() => setOpenAddDialog(false)} onAdd={handleAddModel} />
      </Dialog>
      <Grid container spacing={2}>
        {models.map(model => (
          <Grid item xs={12} sm={6} md={4} key={model._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{model.name}</Typography>
                <Typography variant="body2">Use Case: {model.useCase}</Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} to={`/custom-models/${model.name}`} size="small">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default CustomModelsList;