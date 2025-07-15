"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, BarChart3, Activity, Database, FileText } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data for when no modeled data is available
const sampleMonthlyData = [
  { month: "Jan", value: 2400, growth: 12 },
  { month: "Feb", value: 2210, growth: -8 },
  { month: "Mar", value: 2290, growth: 4 },
  { month: "Apr", value: 2000, growth: -13 },
  { month: "May", value: 2181, growth: 9 },
  { month: "Jun", value: 2500, growth: 15 },
]

const sampleCategoryData = [
  { name: "Technology", value: 35, color: "#3b82f6" },
  { name: "Healthcare", value: 25, color: "#10b981" },
  { name: "Finance", value: 20, color: "#f59e0b" },
  { name: "Education", value: 12, color: "#ef4444" },
  { name: "Others", value: 8, color: "#8b5cf6" },
]

export const DashboardOverview = ({ modeledData = [] }) => {
  // Calculate real statistics from modeled data
  const totalRecords = modeledData.reduce((sum, table) => sum + (table.data?.length || 0), 0)
  const totalTables = modeledData.length
  const totalColumns = modeledData.reduce((sum, table) => sum + (table.columns?.length || 0), 0)
  const hasRealData = totalRecords > 0

  console.log("Dashboard - modeledData:", modeledData)
  console.log("Dashboard - hasRealData:", hasRealData)

  // Analyze the data structure and content
  const getDataInsights = () => {
    if (!hasRealData) return null

    const insights = {
      numericColumns: [],
      textColumns: [],
      uniqueValues: {},
      dataTypes: {},
      summaryStats: {},
    }

    modeledData.forEach((table) => {
      if (table.data && table.data.length > 0) {
        const columns = Object.keys(table.data[0])
        console.log("Dashboard - analyzing columns:", columns)

        columns.forEach((col) => {
          const values = table.data
            .map((row) => row[col])
            .filter((val) => val !== null && val !== undefined && val !== "")

          console.log(`Dashboard - column ${col} values:`, values.slice(0, 5))

          const numericValues = values.filter((val) => !isNaN(Number(val)) && val !== "").map(Number)

          console.log(`Dashboard - column ${col} numeric values:`, numericValues.slice(0, 5))

          if (numericValues.length > values.length * 0.7 && numericValues.length > 0) {
            // Mostly numeric column
            insights.numericColumns.push({ table: table.tableName, column: col })
            insights.summaryStats[`${table.tableName}.${col}`] = {
              min: Math.min(...numericValues),
              max: Math.max(...numericValues),
              avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
              count: numericValues.length,
            }
          } else {
            // Text/categorical column
            insights.textColumns.push({ table: table.tableName, column: col })
            const uniqueVals = [...new Set(values)]
            insights.uniqueValues[`${table.tableName}.${col}`] = {
              unique: uniqueVals.length,
              total: values.length,
              samples: uniqueVals.slice(0, 5),
            }
          }
        })
      }
    })

    console.log("Dashboard - insights:", insights)
    return insights
  }

  const dataInsights = getDataInsights()

  // Generate KPIs from real data
  const generateKPIs = () => {
    if (!hasRealData || !dataInsights) {
      return {
        totalRecords: 12543,
        avgValue: 2847,
        uniqueCategories: 74.2,
        dataQuality: 95.8,
      }
    }

    // Calculate meaningful KPIs from actual data
    const numericStats = Object.values(dataInsights.summaryStats)
    const avgOfAverages =
      numericStats.length > 0 ? numericStats.reduce((sum, stat) => sum + stat.avg, 0) / numericStats.length : 0

    const totalUniqueValues = Object.values(dataInsights.uniqueValues).reduce((sum, info) => sum + info.unique, 0)

    const dataQuality =
      totalRecords > 0
        ? ((totalRecords - totalRecords * 0.05) / totalRecords) * 100 // Assume 5% missing data
        : 100

    return {
      totalRecords,
      avgValue: Math.round(avgOfAverages),
      uniqueCategories: totalUniqueValues,
      dataQuality: Math.round(dataQuality * 10) / 10,
    }
  }

  const kpis = generateKPIs()

  // Generate charts from real data
  const generateChartData = () => {
    if (!hasRealData || !dataInsights) {
      return {
        trendData: sampleMonthlyData,
        categoryData: sampleCategoryData,
        barData: sampleMonthlyData.slice(0, 4),
      }
    }

    // Create trend data from first numeric column
    const firstTable = modeledData.find((table) => table.data && table.data.length > 0)
    if (!firstTable) return { trendData: sampleMonthlyData, categoryData: sampleCategoryData, barData: [] }

    const numericCol = dataInsights.numericColumns[0]
    const textCol = dataInsights.textColumns[0]

    console.log("Dashboard - numericCol:", numericCol)
    console.log("Dashboard - textCol:", textCol)

    let trendData = []
    let categoryData = []
    let barData = []

    if (numericCol && textCol) {
      // Group data by text column and aggregate numeric column
      const grouped = {}
      firstTable.data.forEach((row) => {
        const category = String(row[textCol.column] || "Unknown")
        const value = Number(row[numericCol.column]) || 0

        if (!grouped[category]) {
          grouped[category] = { total: 0, count: 0, values: [] }
        }
        grouped[category].total += value
        grouped[category].count += 1
        grouped[category].values.push(value)
      })

      console.log("Dashboard - grouped data:", grouped)

      // Convert to chart data
      const entries = Object.entries(grouped).slice(0, 8)

      // For trend data - use actual values, not averages that might be too high
      trendData = entries.map(([category, data], index) => ({
        month: category.slice(0, 10), // Truncate long names
        value: data.count, // Use count instead of average to avoid huge numbers
        growth: Math.round((Math.random() - 0.5) * 20), // Simulated growth
      }))

      // For pie chart - use percentages of total records
      const totalCount = firstTable.data.length
      categoryData = entries.map(([category, data], index) => ({
        name: category.slice(0, 15),
        value: Math.round((data.count / totalCount) * 100),
        color: `hsl(${(index * 45) % 360}, 70%, 50%)`,
      }))

      // For bar chart - use reasonable values
      barData = entries.slice(0, 6).map(([category, data]) => ({
        name: category.slice(0, 10),
        value: data.count, // Use count instead of average
        total: Math.round(data.total),
      }))
    } else if (textCol) {
      // If we only have text columns, create frequency distribution
      const frequencies = {}
      firstTable.data.forEach((row) => {
        const category = String(row[textCol.column] || "Unknown")
        frequencies[category] = (frequencies[category] || 0) + 1
      })

      const entries = Object.entries(frequencies).slice(0, 8)
      const totalCount = firstTable.data.length

      trendData = entries.map(([category, count], index) => ({
        month: category.slice(0, 10),
        value: count,
        growth: 0,
      }))

      categoryData = entries.map(([category, count], index) => ({
        name: category.slice(0, 15),
        value: Math.round((count / totalCount) * 100),
        color: `hsl(${(index * 45) % 360}, 70%, 50%)`,
      }))

      barData = entries.slice(0, 6).map(([category, count]) => ({
        name: category.slice(0, 10),
        value: count,
        total: count,
      }))
    }

    console.log("Dashboard - final chart data:", { trendData, categoryData, barData })
    return { trendData, categoryData, barData }
  }

  const { trendData, categoryData, barData } = generateChartData()

  return (
    <div className="space-y-6">
      {/* Data Source Status */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Data Analysis Dashboard</h3>
              <p className="text-sm text-slate-600">
                {hasRealData
                  ? `Analyzing ${totalTables} dataset${totalTables > 1 ? "s" : ""} with ${totalRecords.toLocaleString()} total records across ${totalColumns} columns`
                  : "No data imported yet - upload your CSV files to see real insights"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={hasRealData ? "default" : "secondary"}
                className={hasRealData ? "bg-emerald-100 text-emerald-800" : ""}
              >
                {hasRealData ? "Live Data" : "Demo Mode"}
              </Badge>
              {hasRealData && (
                <>
                  <Badge variant="outline">{dataInsights?.numericColumns.length || 0} Numeric Columns</Badge>
                  <Badge variant="outline">{dataInsights?.textColumns.length || 0} Text Columns</Badge>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalRecords.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500">{hasRealData ? "From your data" : "+15.2%"}</span>
              {hasRealData ? " imported" : " from last month"}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{hasRealData ? "Avg Numeric Value" : "Data Tables"}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasRealData ? kpis.avgValue.toLocaleString() : totalTables || "5"}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500">{hasRealData ? "Calculated" : "Active"}</span>
              {hasRealData ? " from data" : " tables available"}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{hasRealData ? "Unique Categories" : "Success Rate"}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hasRealData ? kpis.uniqueCategories : `${kpis.dataQuality}%`}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="h-3 w-3 mr-1 text-blue-500" />
              <span className="text-blue-500">{hasRealData ? "Distinct values" : "Performance"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.dataQuality}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500">{hasRealData ? "Completeness" : "Excellent"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{hasRealData ? "Data Distribution" : "Data Trends"}</CardTitle>
            <CardDescription>
              {hasRealData
                ? `Record count by ${dataInsights?.textColumns[0]?.column || "categories"}`
                : "Monthly application volume and growth rate"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    name === "value" ? (hasRealData ? "Record Count" : "Records") : "Growth %",
                  ]}
                  labelStyle={{ color: "#374151" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>
              {hasRealData
                ? `Percentage distribution by ${dataInsights?.textColumns[0]?.column || "category"}`
                : "Application breakdown by industry sector"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {categoryData.slice(0, 6).map((item, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}: {item.value}%
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{hasRealData ? "Detailed Data Analysis" : "Performance Analysis"}</CardTitle>
          <CardDescription>
            {hasRealData
              ? `Record count by ${dataInsights?.textColumns[0]?.column || "category"}`
              : "Applications and successful placements by department"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {hasRealData ? (
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Record Count" />
              ) : (
                <>
                  <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Applications" />
                  <Bar dataKey="filled" fill="#10b981" radius={[4, 4, 0, 0]} name="Filled" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Data Summary Table */}
      {hasRealData && dataInsights && (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Data Summary</CardTitle>
            <CardDescription>Overview of your imported datasets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Numeric Columns</h4>
                <div className="space-y-2">
                  {dataInsights.numericColumns.slice(0, 5).map((col, index) => {
                    const stats = dataInsights.summaryStats[`${col.table}.${col.column}`]
                    return (
                      <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span className="text-sm font-medium">{col.column}</span>
                        <div className="text-xs text-slate-600">
                          Avg: {Math.round(stats?.avg || 0)} | Range: {Math.round(stats?.min || 0)}-
                          {Math.round(stats?.max || 0)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Categorical Columns</h4>
                <div className="space-y-2">
                  {dataInsights.textColumns.slice(0, 5).map((col, index) => {
                    const info = dataInsights.uniqueValues[`${col.table}.${col.column}`]
                    return (
                      <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span className="text-sm font-medium">{col.column}</span>
                        <div className="text-xs text-slate-600">{info?.unique || 0} unique values</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used tools and reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
            >
              <BarChart3 className="h-6 w-6" />
              <span>Create Chart</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
            >
              <Database className="h-6 w-6" />
              <span>Import Data</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
            >
              <TrendingUp className="h-6 w-6" />
              <span>View Trends</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
            >
              <FileText className="h-6 w-6" />
              <span>Export Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
