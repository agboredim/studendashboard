import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Plus,
  Settings,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const sampleData = [
  { name: "Q1", applications: 2400, hired: 800, interviews: 1200 },
  { name: "Q2", applications: 2210, hired: 950, interviews: 1100 },
  { name: "Q3", applications: 2290, hired: 720, interviews: 1300 },
  { name: "Q4", applications: 2000, hired: 680, interviews: 1000 },
];

const pieData = [
  { name: "Engineering", value: 40, color: "#3b82f6" },
  { name: "Sales", value: 25, color: "#10b981" },
  { name: "Marketing", value: 20, color: "#f59e0b" },
  { name: "Operations", value: 15, color: "#ef4444" },
];

const chartTypes = [
  { name: "Bar Chart", icon: BarChart3, description: "Compare categories" },
  {
    name: "Line Chart",
    icon: TrendingUp,
    description: "Show trends over time",
  },
  { name: "Pie Chart", icon: PieChart, description: "Show proportions" },
  {
    name: "Area Chart",
    icon: Activity,
    description: "Visualize volume changes",
  },
];

export const VisualizationStudio = () => {
  const [selectedChart, setSelectedChart] = useState("bar");
  const [selectedData, setSelectedData] = useState("quarterly");

  const renderChart = () => {
    switch (selectedChart) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="applications"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar dataKey="hired" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#3b82f6"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="hired"
                stroke="#10b981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart>
              <RechartsPieChart
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RechartsPieChart>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="applications"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="hired"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Visualization Studio
          </h2>
          <p className="text-slate-600">
            Create interactive charts and dashboards
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Visualization
        </Button>
      </div>

      <Tabs defaultValue="builder" className="space-y-6">
        <TabsList>
          <TabsTrigger value="builder">Chart Builder</TabsTrigger>
          <TabsTrigger value="gallery">Chart Gallery</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Controls */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Chart Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Chart Type
                  </label>
                  <Select
                    value={selectedChart}
                    onValueChange={setSelectedChart}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Data Source
                  </label>
                  <Select value={selectedData} onValueChange={setSelectedData}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quarterly">Quarterly Data</SelectItem>
                      <SelectItem value="monthly">Monthly Data</SelectItem>
                      <SelectItem value="department">
                        Department Data
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Filters</label>
                  <div className="space-y-2">
                    <Badge variant="outline">Engineering</Badge>
                    <Badge variant="outline">2024</Badge>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Settings
                </Button>
              </CardContent>
            </Card>

            {/* Chart Display */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Career Applications Analysis</CardTitle>
                    <CardDescription>
                      Interactive visualization of hiring data
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      Save
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>{renderChart()}</CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {chartTypes.map((chart, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group"
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <chart.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{chart.name}</CardTitle>
                  <CardDescription>{chart.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full">
                    Create Chart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sample Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={sampleData.slice(0, 3)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="applications"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hiring Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="hired"
                      stroke="#10b981"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Executive Dashboard",
                description: "High-level KPIs and metrics",
                charts: 6,
              },
              {
                name: "Department Analysis",
                description: "Department-specific insights",
                charts: 4,
              },
              {
                name: "Recruitment Funnel",
                description: "Application to hire journey",
                charts: 5,
              },
              {
                name: "Performance Review",
                description: "Employee performance metrics",
                charts: 7,
              },
              {
                name: "Diversity Report",
                description: "Diversity and inclusion metrics",
                charts: 4,
              },
              {
                name: "Cost Analysis",
                description: "Hiring costs and ROI",
                charts: 5,
              },
            ].map((template, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{template.charts} charts</Badge>
                    <Button variant="outline" size="sm">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
