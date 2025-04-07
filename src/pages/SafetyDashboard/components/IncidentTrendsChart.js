import React from 'react';
import { Box } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan 2025', noHairnet: 17, noGloves: 22, noMask: 15, noShoes: 5 },
  { month: 'Feb 2025', noHairnet: 15, noGloves: 24, noMask: 18, noShoes: 5 },
  { month: 'Mar 2025', noHairnet: 20, noGloves: 26, noMask: 20, noShoes: 9 },
  { month: 'Apr 2025', noHairnet: 14, noGloves: 22, noMask: 15, noShoes: 4 },
  { month: 'May 2025', noHairnet: 18, noGloves: 26, noMask: 18, noShoes: 8 },
  { month: 'Jun 2025', noHairnet: 21, noGloves: 30, noMask: 20, noShoes: 9 },
  { month: 'Jul 2025', noHairnet: 22, noGloves: 33, noMask: 22, noShoes: 10 },
];

const IncidentTrendsChart = ({ filters = { noHairnet: true, noGloves: true, noMask: true, noShoes: true } }) => {
  return (
    <Box sx={{ width: '100%', height: 350, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorNoHairnet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorNoGloves" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4572cd" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#4572cd" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorNoMask" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#4caf50" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorNoShoes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef5350" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef5350" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="month" 
            axisLine={{ stroke: '#e0e0e0' }}
            tickLine={false}
            tick={{ fill: '#888' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#888' }}
            domain={[0, 'dataMax + 20']}
          />
          <Tooltip />
          {filters.noHairnet && (
            <Area 
              type="monotone" 
              dataKey="noHairnet" 
              stackId="1" 
              stroke="#8884d8" 
              fillOpacity={1}
              fill="url(#colorNoHairnet)"
              name="No Hairnet" 
            />
          )}
          {filters.noGloves && (
            <Area 
              type="monotone" 
              dataKey="noGloves" 
              stackId="1" 
              stroke="#4572cd" 
              fillOpacity={1}
              fill="url(#colorNoGloves)"
              name="No Gloves" 
            />
          )}
          {filters.noMask && (
            <Area 
              type="monotone" 
              dataKey="noMask" 
              stackId="1" 
              stroke="#4caf50" 
              fillOpacity={1}
              fill="url(#colorNoMask)"
              name="No Mask" 
            />
          )}
          {filters.noShoes && (
            <Area 
              type="monotone" 
              dataKey="noShoes" 
              stackId="1" 
              stroke="#ef5350" 
              fillOpacity={1}
              fill="url(#colorNoShoes)"
              name="No Shoes" 
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default IncidentTrendsChart; 