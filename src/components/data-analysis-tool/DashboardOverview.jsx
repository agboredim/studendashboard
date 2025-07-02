import { useSelector, useDispatch } from "react-redux";
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
  Users,
  BarChart3,
  Activity,
  PieChart,
  TrendingUp,
  TrendingDown,
  Filter,
} from "lucide-react";
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
  Cell,
} from "recharts";
import {
  selectMonthlyData,
  selectDepartmentData,
  selectIndustryData,
  selectFilters,
  selectKPIs,
  updateFilter,
  clearFilters,
} from "@/store/slices/dataAnalysisSlice";

// Custom Select Component
const Select = ({ value, onValueChange, children, className = "" }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {children}
    </select>
  );
};

const SelectItem = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const monthlyData = useSelector(selectMonthlyData);
  const departmentData = useSelector(selectDepartmentData);
  const industryData = useSelector(selectIndustryData);
  const filters = useSelector(selectFilters);
  const kpis = useSelector(selectKPIs);

  const handleFilterChange = (key, value) => {
    dispatch(updateFilter({ key, value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="min-w-48">
              <Select
                value={filters.department}
                onValueChange={(value) =>
                  handleFilterChange("department", value)
                }
              >
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </Select>
            </div>

            <div className="min-w-48">
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Screening">Screening</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Offer">Offer</SelectItem>
                <SelectItem value="Hired">Hired</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </Select>
            </div>

            <Button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleFilterChange("status", "all")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.totalApplications.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500">+15.2%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleFilterChange("status", "Hired")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Positions Filled
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.hired.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500">+8.7%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.successRate}%</div>
            <div className="flex items-center text-xs text-gray-500">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              <span className="text-red-500">-2.1%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Time to Hire
            </CardTitle>
            <PieChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.avgTimeToHire} days</div>
            <div className="flex items-center text-xs text-gray-500">
              <TrendingDown className="h-3 w-3 mr-1 text-emerald-500" />
              <span className="text-emerald-500">-1.2 days</span> from last
              month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
            <CardDescription>
              Monthly application volume and hiring success
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    value.toLocaleString(),
                    name === "applications"
                      ? "Applications"
                      : name === "hired"
                      ? "Hired"
                      : "Interviews",
                  ]}
                  labelStyle={{ color: "#374151" }}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="hired"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Industry Distribution */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Industry Distribution</CardTitle>
            <CardDescription>
              Application breakdown by industry sector
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <RechartsPieChart
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {industryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </RechartsPieChart>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {industryData.map((item, index) => (
                <Badge
                  key={index}
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 border border-slate-300 text-slate-700"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}: {item.value}%
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>
            Applications and successful placements by department (Click bars to
            filter)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="applications"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 cursor-pointer"
                onClick={(data) =>
                  handleFilterChange("department", data.department)
                }
              />
              <Bar
                dataKey="hired"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Current Filter Display */}
      {(filters.department !== "all" || filters.status !== "all") && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Active Filters:
                </span>
                {filters.department !== "all" && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {filters.department}
                  </Badge>
                )}
                {filters.status !== "all" && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {filters.status}
                  </Badge>
                )}
              </div>
              <Button
                onClick={handleClearFilters}
                className="text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardOverview;
