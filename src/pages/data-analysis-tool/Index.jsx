"use client";

import { useState } from "react";
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
  Download,
  Share,
} from "lucide-react";

// Import all components
import { DashboardOverview } from "@/components/data-analysis-tool/DashboardOverview";
import { DataConnectivity } from "@/components/data-analysis-tool/DataConnectivity";
import { VisualizationStudio } from "@/components/data-analysis-tool/VisualizationStudio";
import { DataModeling } from "@/components/data-analysis-tool/DataModeling";
import { ReportsCenter } from "@/components/data-analysis-tool/ReportsCenter";

const DataAnalysisTool = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [modeledData, setModeledData] = useState([]);
  const [connectedSources, setConnectedSources] = useState([]);
  const [pendingImport, setPendingImport] = useState(null); // New state for pending imports

  // Handle data flow between components
  const handleDataModelChange = (newModeledData) => {
    setModeledData(newModeledData);
    console.log("Data model updated:", newModeledData);
  };

  const handleDataImported = (importedData) => {
    setConnectedSources((prev) => [...prev, importedData]);
    console.log("Data imported:", importedData);
    // Store for DataModeling component
    setPendingImport(importedData);
    // Auto-switch to modeling tab when data is imported
    setActiveTab("modeling");
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
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-800"
              >
                Enterprise Edition
              </Badge>
              {modeledData.length > 0 && (
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  {modeledData.length} Tables Modeled
                </Badge>
              )}
              {pendingImport && (
                <Badge
                  variant="default"
                  className="bg-yellow-100 text-yellow-800"
                >
                  Import Ready
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
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
          onValueChange={setActiveTab}
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
              {pendingImport && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="modeling"
              className="flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Data Modeling</span>
              {pendingImport && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="visualization"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Visualizations</span>
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
            <DashboardOverview modeledData={modeledData} />
          </TabsContent>

          <TabsContent value="connectivity" className="space-y-6">
            <DataConnectivity onDataImported={handleDataImported} />
          </TabsContent>

          <TabsContent value="modeling" className="space-y-6">
            <DataModeling
              onDataModelChange={handleDataModelChange}
              pendingImport={pendingImport}
              onImportProcessed={() => setPendingImport(null)}
            />
          </TabsContent>

          <TabsContent value="visualization" className="space-y-6">
            <VisualizationStudio modeledData={modeledData} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsCenter modeledData={modeledData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataAnalysisTool;
