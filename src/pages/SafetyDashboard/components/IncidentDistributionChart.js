import React from 'react';
import { Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'No Hairnet', value: 31, color: '#8884d8', key: 'noHairnet' },
  { name: 'No Gloves', value: 41, color: '#4572cd', key: 'noGloves' },
  { name: 'No Mask', value: 19, color: '#4caf50', key: 'noMask' },
  { name: 'No Shoes', value: 9, color: '#ef5350', key: 'noShoes' },
];

const COLORS = ['#8884d8', '#4572cd', '#4caf50', '#ef5350'];

const IncidentDistributionChart = ({ filters = { noHairnet: true, noGloves: true, noMask: true, noShoes: true } }) => {
  // Filter data based on the filters prop
  const filteredData = data.filter(item => filters[item.key]);

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      {/* Chart container */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
              const RADIAN = Math.PI / 180;
              const radius = outerRadius + 25;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              const item = filteredData[index];
              
              return (
                <text 
                  x={x} 
                  y={y} 
                  fill={item.color}
                  textAnchor={x > cx ? 'start' : 'end'} 
                  dominantBaseline="central"
                >
                  {`${item.name}: ${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default IncidentDistributionChart; 