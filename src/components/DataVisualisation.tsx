import { motion } from 'framer-motion';
import { Factory, Leaf, TreePine, Truck } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { retrievalJSONEndpoint } from '@/data/api';
import { useEffect, useState } from 'react';

export function DataVisualisation() {

  const [scope1Emissions, setScope1Emissions] = useState(0);
  const [scope2Emissions, setScope2Emissions] = useState(0);
  const [scope3Emissions, setScope3Emissions] = useState(0);
  const [companyRankings, setCompanyRankings] = useState([]);
  const companyEmissionMap = {};

  const emissionMetrics = [
    {
      title: 'Total CO₂ Emissions',
      value: (scope1Emissions + scope2Emissions + scope3Emissions).toString(),
      change: '-8%',
      unit: 'KTons CO₂e',
      icon: Leaf,
      description: 'All Scopes Combined',
    },
    {
      title: 'Scope 1 Emissions',
      value: scope1Emissions.toString(),
      change: '-12%',
      unit: 'KTons CO₂e',
      icon: Factory,
      description: 'Direct Emissions',
    },
    {
      title: 'Scope 2 Emissions',
      value: scope2Emissions.toString(),
      change: '-5%',
      unit: 'KTons CO₂e',
      icon: TreePine,
      description: 'Indirect Energy',
    },
    {
      title: 'Scope 3 Emissions',
      value: scope3Emissions.toString(),
      change: '-7%',
      unit: 'KTons CO₂e',
      icon: Truck,
      description: 'Value Chain',
    },
  ];

  const mockData = {
    yearlyEmissions: Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      emissions: [1000, 1300, 1500, 2000, 750, 730, 800, 1000, 400, 1100, 1600, 1000][i],
    })),
    scopeDistribution: [
      { scope: 'Scope 1', emissions: scope1Emissions },
      { scope: 'Scope 2', emissions: scope2Emissions },
      { scope: 'Scope 3', emissions: scope3Emissions },
    ],
    companyRankings: companyRankings.sort((a, b) => b.emissions - a.emissions),
  };

  useEffect(() => {
    console.log("Getting data from backend");
    const xhr = new XMLHttpRequest();
    xhr.open('GET', retrievalJSONEndpoint);
    xhr.onload = function() {
      const res = JSON.parse(xhr.response);
      if (xhr.status === 200) {
        console.log(res);
        if (res["body"]) {
          const events = res["body"]["events"].filter((obj: any) => {
            return obj["attribute"]["metric_name"].includes("CO2") && obj["attribute"]["metric_unit"].includes("Tons CO2e");
          });
          console.log(events);
          let local1Emissions = 0;
          let local2Emissions = 0;
          let local3Emissions = 0;
          events.forEach((event) => {
            const metricValue = parseInt(event["attribute"]["metric_value"])
            const metricName = event["attribute"]["metric_name"]
            const companyName = event["attribute"]["company_name"]
            if (companyName in companyEmissionMap) {
              companyEmissionMap[companyName] += metricValue;
            } else {
              companyEmissionMap[companyName] = metricValue;
            }
            if (metricName.includes("SCOPE1")) {
              local1Emissions += metricValue;
            }
            if (metricName.includes("SCOPE2")) {
              local2Emissions += metricValue;
            }
            if (metricName.includes("SCOPE3")) {
              local3Emissions += metricValue;
            }
          });
          setScope1Emissions(parseInt((local1Emissions / 1000).toFixed(0)));
          setScope2Emissions(parseInt((local2Emissions / 1000).toFixed(0)));
          setScope3Emissions(parseInt((local3Emissions / 1000).toFixed(0)));
          let rankings = Object.keys(companyEmissionMap).map((key) => [key, parseInt(companyEmissionMap[key])]);
          rankings.sort((a, b) => { return a[1] - b[1]; });
          rankings = rankings.slice(0, 5).map((key) => {return { "company": key[0], "emissions": key[1]}})
          console.log(rankings);
          setCompanyRankings(rankings);
        }
      } else {
        console.log("Error:", res);
      }
    }
    xhr.send();
  }, []);

  return (
    <div className="h-full space-y-6 overflow-y-auto">
      <div className="grid gap-4 md:grid-cols-4">
        {emissionMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-1">
                  <span className="text-2xl font-bold">
                    {metric.value}
                    <span className="text-sm font-normal text-muted-foreground"> {metric.unit}</span>
                  </span>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                  <p className="text-xs">
                    <span className="text-green-500">{metric.change}</span> from last year
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>CO₂ Emissions Trend</CardTitle>
            <CardDescription>Monthly emissions data</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.yearlyEmissions}>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip
                  formatter={(value: number) => [`${value} Tons CO₂e`, 'Emissions']}
                />
                <Area
                  type="monotone"
                  dataKey="emissions"
                  stroke="hsl(142, 76%, 36%)"
                  fillOpacity={1}
                  fill="url(#colorEmissions)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emissions by Scope</CardTitle>
            <CardDescription>Distribution across emission scopes</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.scopeDistribution}>
                <XAxis dataKey="scope" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value} KTons CO₂e`, 'Emissions']}
                />
                <Bar
                  dataKey="emissions"
                  fill="hsl(142, 76%, 36%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Company Rankings</CardTitle>
            <CardDescription>CO₂ emissions comparison across companies</CardDescription>
          </CardHeader>
          <CardContent className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData.companyRankings}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis type="category" dataKey="company" fontSize={"8px"}/>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip
                  formatter={(value: number) => [`${value} Tons CO₂e`, 'Emissions']}
                />
                <Bar
                  dataKey="emissions"
                  fill="hsl(142, 76%, 36%)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}