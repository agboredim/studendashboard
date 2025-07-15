"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Settings } from "lucide-react";
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
  Legend,
} from "recharts";
import { Checkbox } from "@/components/ui/checkbox";

// Sample data for when no modeled data is available
const sampleData = [
  { name: "Q1", applications: 2400, hired: 800, interviews: 1200 },
  { name: "Q2", applications: 2210, hired: 950, interviews: 1100 },
  { name: "Q3", applications: 2290, hired: 720, interviews: 1300 },
  { name: "Q4", applications: 2000, hired: 680, interviews: 1000 },
];

export const VisualizationStudio = ({ modeledData = [] }) => {
  const [selectedChart, setSelectedChart] = useState("bar");
  const [selectedDataSource, setSelectedDataSource] = useState("sample");
  const [availableDataSources, setAvailableDataSources] = useState([]);
  const [chartData, setChartData] = useState(sampleData);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedXColumn, setSelectedXColumn] = useState("");
  const [selectedYColumns, setSelectedYColumns] = useState([]);

  const isModeledData = selectedDataSource.startsWith("modeled_");

  // Update available data sources when modeled data changes
  useEffect(() => {
    const sources = [
      { value: "sample", label: "Sample Data", data: sampleData },
    ];

    if (modeledData && modeledData.length > 0) {
      modeledData.forEach((table) => {
        if (table.data && table.data.length > 0) {
          sources.push({
            value: `modeled_${table.tableName}`,
            label: `${table.tableName} (${table.data.length} records)`,
            data: table.data,
            columns: table.columns || Object.keys(table.data[0] || {}),
          });
        }
      });
    }

    setAvailableDataSources(sources);
  }, [modeledData]);

  // Reset selections when data source changes
  useEffect(() => {
    const selectedSource = availableDataSources.find(
      (source) => source.value === selectedDataSource
    );
    if (selectedSource) {
      console.log("=== VISUALIZATION DEBUG ===");
      console.log("Selected source:", selectedSource.value);
      console.log("Raw data sample:", selectedSource.data?.slice(0, 2));

      if (selectedSource.data && selectedSource.data.length > 0) {
        const firstRow = selectedSource.data[0];
        console.log("First row structure:", firstRow);
        console.log("Available keys:", Object.keys(firstRow));

        // Get all column names
        const columns = Object.keys(firstRow);
        setAvailableColumns(columns);

        // Reset selections when switching data sources
        setSelectedXColumn(columns[0] || "");
        setSelectedYColumns([]);

        // Auto-select numeric columns as Y-axis for modeled data
        if (isModeledData) {
          const numericColumns = columns.filter((col) => {
            const sampleValues = selectedSource.data
              .slice(0, 5)
              .map((row) => row[col]);
            return sampleValues.some(
              (val) => !isNaN(Number(val)) && val !== "" && val !== null
            );
          });
          setSelectedYColumns(numericColumns.slice(0, 2)); // Start with 2 columns
        } else {
          // For sample data, use predefined columns
          setSelectedYColumns(["applications", "hired"]);
        }

        console.log("Available columns:", columns);
        console.log(
          "Auto-selected Y columns:",
          isModeledData
            ? columns
                .filter((col) => {
                  const sampleValues = selectedSource.data
                    .slice(0, 5)
                    .map((row) => row[col]);
                  return sampleValues.some(
                    (val) => !isNaN(Number(val)) && val !== "" && val !== null
                  );
                })
                .slice(0, 2)
            : ["applications", "hired"]
        );
      }

      setChartData(selectedSource.data || sampleData);
    }
  }, [selectedDataSource, availableDataSources, isModeledData]);

  // Process data for charts
  const getProcessedChartData = () => {
    if (!chartData || chartData.length === 0) return [];

    if (!isModeledData) {
      // Return sample data as-is
      return chartData;
    }

    // For modeled data, process it properly
    return chartData.slice(0, 50).map((item, index) => {
      const result = {
        name: selectedXColumn
          ? String(item[selectedXColumn] || `Item ${index + 1}`)
          : `Item ${index + 1}`,
      };

      // Add selected Y columns as numeric values
      selectedYColumns.forEach((col) => {
        const rawValue = item[col];
        const numValue = Number(rawValue);
        result[col] = isNaN(numValue) ? 0 : numValue;
      });

      return result;
    });
  };

  const processedData = getProcessedChartData();

  const handleYColumnToggle = (column, checked) => {
    if (checked) {
      if (selectedYColumns.length < 3) {
        setSelectedYColumns((prev) => [...prev, column]);
      }
    } else {
      setSelectedYColumns((prev) => prev.filter((col) => col !== column));
    }
  };

  const renderChart = () => {
    const data = processedData;

    switch (selectedChart) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedYColumns.map((col, index) => (
                <Bar
                  key={col}
                  dataKey={col}
                  fill={`hsl(${(index * 120) % 360}, 70%, 50%)`}
                  radius={[4, 4, 0, 0]}
                  name={col}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedYColumns.map((col, index) => (
                <Line
                  key={col}
                  type="monotone"
                  dataKey={col}
                  stroke={`hsl(${(index * 120) % 360}, 70%, 50%)`}
                  strokeWidth={3}
                  name={col}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        const pieData = data.slice(0, 8).map((item, index) => ({
          name: item.name,
          value:
            selectedYColumns.length > 0 ? item[selectedYColumns[0]] || 0 : 0,
          color: `hsl(${(index * 45) % 360}, 70%, 50%)`,
        }));

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
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedYColumns.map((col, index) => (
                <Area
                  key={col}
                  type="monotone"
                  dataKey={col}
                  stackId="1"
                  stroke={`hsl(${(index * 120) % 360}, 70%, 50%)`}
                  fill={`hsl(${(index * 120) % 360}, 70%, 50%)`}
                  fillOpacity={0.6}
                  name={col}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const currentSource = availableDataSources.find(
    (source) => source.value === selectedDataSource
  );
  const hasModeledData = modeledData.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Visualization Studio
          </h2>
          <p className="text-slate-600">
            Create interactive charts from your data
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasModeledData && (
            <Badge
              variant="default"
              className="bg-emerald-100 text-emerald-800"
            >
              {modeledData.length} Data Sources Available
            </Badge>
          )}
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Save Chart
          </Button>
        </div>
      </div>

      {/* Data Source Status */}
      {!hasModeledData && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">No Modeled Data Available</h3>
                <p className="text-sm text-slate-600">
                  Import and model your data first to create visualizations with
                  real data.
                </p>
              </div>
              <Badge variant="secondary">Using Sample Data</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Chart Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Data Source
              </Label>
              <Select
                value={selectedDataSource}
                onValueChange={setSelectedDataSource}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  {availableDataSources.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Chart Type
              </Label>
              <Select value={selectedChart} onValueChange={setSelectedChart}>
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

            {/* Column Selection */}
            {availableColumns.length > 0 && (
              <>
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    X-Axis Column
                  </Label>
                  <Select
                    value={selectedXColumn}
                    onValueChange={setSelectedXColumn}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select X column" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColumns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Y-Axis Columns
                  </Label>
                  <div className="space-y-3 max-h-40 overflow-y-auto border rounded-md p-2">
                    {availableColumns.map((col) => (
                      <div key={col} className="flex items-center space-x-2">
                        <Checkbox
                          id={`checkbox-${col}`}
                          checked={selectedYColumns.includes(col)}
                          onCheckedChange={(checked) =>
                            handleYColumnToggle(col, checked)
                          }
                          disabled={
                            !selectedYColumns.includes(col) &&
                            selectedYColumns.length >= 3
                          }
                        />
                        <Label
                          htmlFor={`checkbox-${col}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {col}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedYColumns.length}/3 columns selected
                  </p>
                </div>
              </>
            )}

            {/* Data Preview */}
            {currentSource && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Data Preview</h4>
                <div className="text-xs text-slate-600">
                  <div>{currentSource.data?.length || 0} records available</div>
                  {processedData.length > 0 && (
                    <div className="mt-2 p-2 bg-white rounded border">
                      <div className="text-xs font-medium">
                        Processed Data Sample:
                      </div>
                      <div className="text-xs mt-1 space-y-1">
                        {Object.entries(processedData[0] || {})
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-medium">{key}:</span>
                              <span className="text-slate-600">
                                {value === null || value === undefined
                                  ? "null"
                                  : String(value)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart Display */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {currentSource?.label || "Data Visualization"}
                </CardTitle>
                <CardDescription>
                  {selectedChart.charAt(0).toUpperCase() +
                    selectedChart.slice(1)}{" "}
                  chart
                  {selectedXColumn && ` • X: ${selectedXColumn}`}
                  {selectedYColumns.length > 0 &&
                    ` • Y: ${selectedYColumns.join(", ")}`}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderChart()}</CardContent>
        </Card>
      </div>
    </div>
  );
};
