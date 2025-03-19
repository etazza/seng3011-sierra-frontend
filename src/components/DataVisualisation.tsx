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

const mockData = {
  yearlyEmissions: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    emissions: Math.floor(Math.random() * 1000) + 500,
  })),
  scopeDistribution: [
    { scope: 'Scope 1', emissions: 450 },
    { scope: 'Scope 2', emissions: 850 },
    { scope: 'Scope 3', emissions: 1200 },
  ],
  companyRankings: [
    { company: 'Company A', emissions: 2500 },
    { company: 'Your Company', emissions: 2100 },
    { company: 'Company B', emissions: 1800 },
    { company: 'Company C', emissions: 1500 },
    { company: 'Company D', emissions: 1200 },
  ].sort((a, b) => b.emissions - a.emissions),
};

const emissionMetrics = [
  {
    title: 'Total CO₂ Emissions',
    value: '2,500',
    change: '-8%',
    unit: 'Tons CO₂e',
    icon: Leaf,
    description: 'All Scopes Combined',
  },
  {
    title: 'Scope 1 Emissions',
    value: '450',
    change: '-12%',
    unit: 'Tons CO₂e',
    icon: Factory,
    description: 'Direct Emissions',
  },
  {
    title: 'Scope 2 Emissions',
    value: '850',
    change: '-5%',
    unit: 'Tons CO₂e',
    icon: TreePine,
    description: 'Indirect Energy',
  },
  {
    title: 'Scope 3 Emissions',
    value: '1,200',
    change: '-7%',
    unit: 'Tons CO₂e',
    icon: Truck,
    description: 'Value Chain',
  },
];

export function DataVisualisation() {
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
                  formatter={(value: number) => [`${value} Tons CO₂e`, 'Emissions']}
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
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData.companyRankings}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis type="category" dataKey="company" />
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