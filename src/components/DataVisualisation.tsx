import { useEffect, useState } from 'react';
import { retrievalJSONEndpoint } from '../data/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DataVisualisation = () => {
  const [scope1Emissions, setScope1Emissions] = useState(0);
  const [scope2Emissions, setScope2Emissions] = useState(0);
  const [scope3Emissions, setScope3Emissions] = useState(0);

  useEffect(() => {
    fetch(retrievalJSONEndpoint)
      .then((response) => response.json())
      .then((data) => {
        // Process the data and set emission values
        setScope1Emissions(data.scope1 || 0);
        setScope2Emissions(data.scope2 || 0);
        setScope3Emissions(data.scope3 || 0);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="space-y-4 p-4">
      <h2>CO₂ Emissions Visualisation</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Emissions by Scope</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={[{ name: 'Scope 1', value: scope1Emissions }, { name: 'Scope 2', value: scope2Emissions }, { name: 'Scope 3', value: scope3Emissions }]}>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="hsl(142, 76%, 36%)" fill="url(#colorEmissions)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};