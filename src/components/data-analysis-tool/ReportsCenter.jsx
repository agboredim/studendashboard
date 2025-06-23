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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Share,
  Download,
  Calendar,
  Filter,
  Search,
  Plus,
  BarChart3,
  Users,
  TrendingUp,
} from "lucide-react";

const reports = [
  {
    name: "Monthly Hiring Report",
    description: "Comprehensive analysis of monthly recruitment metrics",
    lastRun: "2 hours ago",
    frequency: "Monthly",
    status: "active",
    type: "automated",
    views: 1247,
  },
  {
    name: "Department Performance",
    description: "Performance metrics by department and team",
    lastRun: "1 day ago",
    frequency: "Weekly",
    status: "active",
    type: "automated",
    views: 892,
  },
  {
    name: "Candidate Pipeline Analysis",
    description: "Deep dive into recruitment funnel metrics",
    lastRun: "5 hours ago",
    frequency: "Daily",
    status: "active",
    type: "automated",
    views: 654,
  },
  {
    name: "Cost per Hire Analysis",
    description: "Financial analysis of recruitment costs",
    lastRun: "3 days ago",
    frequency: "Quarterly",
    status: "scheduled",
    type: "custom",
    views: 321,
  },
];

const templates = [
  {
    name: "Executive Summary",
    description: "High-level KPIs for leadership",
    category: "Executive",
    icon: TrendingUp,
    color: "blue",
  },
  {
    name: "HR Dashboard",
    description: "Comprehensive HR metrics",
    category: "HR",
    icon: Users,
    color: "emerald",
  },
  {
    name: "Recruitment Funnel",
    description: "Application to hire journey",
    category: "Recruitment",
    icon: BarChart3,
    color: "purple",
  },
  {
    name: "Diversity Report",
    description: "Diversity and inclusion metrics",
    category: "Compliance",
    icon: FileText,
    color: "orange",
  },
];

export const ReportsCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredReports = reports.filter((report) =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports Center</h2>
          <p className="text-slate-600">
            Generate and manage your analytics reports
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">My Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="recruitment">Recruitment</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map((report, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {report.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        report.status === "active" ? "default" : "secondary"
                      }
                      className={
                        report.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : ""
                      }
                    >
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Last run:</span>
                      <span className="font-medium">{report.lastRun}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Frequency:</span>
                      <Badge variant="outline">{report.frequency}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Views:</span>
                      <span className="font-medium">
                        {report.views.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group"
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto rounded-lg bg-${template.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <template.icon
                      className={`w-6 h-6 text-${template.color}-600`}
                    />
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="secondary" className="mb-4">
                    {template.category}
                  </Badge>
                  <Button variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>
                Create your own custom reports with our drag-and-drop builder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-slate-600 mb-2">
                    Build custom reports with our visual editor
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Start Building
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Manage automated report generation and delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports
                  .filter((r) => r.type === "automated")
                  .map((report, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-slate-600">
                          Runs {report.frequency.toLowerCase()} • Next: Tomorrow
                          9:00 AM
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{report.frequency}</Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shared Reports</CardTitle>
              <CardDescription>
                Reports shared with your team and stakeholders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Share className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 mb-4">No shared reports yet</p>
                <Button variant="outline">Share a Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
