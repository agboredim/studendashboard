// pages/data-analysis-tool/index.jsx
import { useSelector, useDispatch } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Database,
  FileSpreadsheet,
  TrendingUp,
  Users,
  Settings,
  Share,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  selectActiveTab,
  setActiveTab,
} from "@/store/slices/dataAnalysisSlice";
import DashboardOverview from "@/components/data-analysis-tool/DashboardOverview";
import DataConnectivity from "@/components/data-analysis-tool/DataConnectivity";

const Index = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectActiveTab);

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  TITAN CAREERS
                </h1>
                <p className="text-sm text-slate-600">Data Analysis Tool</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-emerald-100 text-emerald-800">
                Enterprise Edition
              </Badge>
              <Button className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 bg-white rounded-lg shadow-sm border">
            <TabsTrigger
              value="dashboard"
              className="flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="connectivity"
              className="flex items-center space-x-2"
            >
              <Database className="w-4 h-4" />
              <span>Data Sources</span>
            </TabsTrigger>
            <TabsTrigger
              value="visualization"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Visualizations</span>
            </TabsTrigger>
            <TabsTrigger
              value="modeling"
              className="flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Data Modeling</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="connectivity" className="space-y-6">
            <DataConnectivity />
          </TabsContent>

          <TabsContent value="visualization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visualization Studio</CardTitle>
                <CardDescription>
                  Interactive chart builder and templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600 mb-4">
                    Visualization Studio - Coming Soon
                  </p>
                  <p className="text-sm text-slate-500">
                    Create custom interactive charts and dashboards
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modeling" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Modeling</CardTitle>
                <CardDescription>
                  Manage data relationships and schema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600 mb-4">
                    Data Modeling - Coming Soon
                  </p>
                  <p className="text-sm text-slate-500">
                    Design and manage your data structure
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports Center</CardTitle>
                <CardDescription>
                  Generate and schedule automated reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600 mb-4">
                    Reports Center - Coming Soon
                  </p>
                  <p className="text-sm text-slate-500">
                    Create and manage automated reports
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
