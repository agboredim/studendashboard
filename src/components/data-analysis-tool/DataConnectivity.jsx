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
  Upload,
  Database,
  Link,
  FileText,
  Settings,
  Check,
  AlertCircle,
  Plus,
} from "lucide-react";

const DataConnectivity = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const dataSources = [
    {
      name: "Excel/CSV Files",
      icon: FileText,
      description: "Upload spreadsheet files",
      status: "ready",
      color: "emerald",
    },
    {
      name: "SQL Database",
      icon: Database,
      description: "Connect to SQL Server, MySQL, PostgreSQL",
      status: "connected",
      color: "blue",
    },
    {
      name: "Web APIs",
      icon: Link,
      description: "REST APIs, OData feeds",
      status: "ready",
      color: "purple",
    },
    {
      name: "Cloud Services",
      icon: Upload,
      description: "Azure, AWS, Google Cloud",
      status: "ready",
      color: "orange",
    },
  ];

  const connectedSources = [
    {
      name: "HR Database",
      type: "PostgreSQL",
      lastSync: "2 hours ago",
      records: "12,543",
      status: "active",
    },
    {
      name: "Applicant Tracking",
      type: "REST API",
      lastSync: "30 minutes ago",
      records: "8,291",
      status: "active",
    },
    {
      name: "Interview Feedback",
      type: "CSV Import",
      lastSync: "1 day ago",
      records: "2,847",
      status: "syncing",
    },
  ];

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Data Connectivity
          </h2>
          <p className="text-slate-600">Connect and manage your data sources</p>
        </div>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Connection
        </Button>
      </div>

      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white rounded-lg shadow-sm border">
          <TabsTrigger value="sources">Available Sources</TabsTrigger>
          <TabsTrigger value="connected">Connected Sources</TabsTrigger>
          <TabsTrigger value="upload">File Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataSources.map((source, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto rounded-lg bg-${source.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <source.icon
                      className={`w-6 h-6 text-${source.color}-600`}
                    />
                  </div>
                  <CardTitle className="text-lg">{source.name}</CardTitle>
                  <CardDescription>{source.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge
                    className={
                      source.status === "connected"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-800"
                    }
                  >
                    {source.status === "connected" ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Connected
                      </>
                    ) : (
                      "Ready to Connect"
                    )}
                  </Badge>
                  <Button className="w-full mt-4 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                    {source.status === "connected" ? "Configure" : "Connect"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connected" className="space-y-6">
          <div className="space-y-4">
            {connectedSources.map((source, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {source.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {source.type} • {source.records} records
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Last sync: {source.lastSync}
                      </p>
                      <Badge
                        className={
                          source.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : source.status === "syncing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-slate-100 text-slate-800"
                        }
                      >
                        {source.status === "active" && (
                          <Check className="w-3 h-3 mr-1" />
                        )}
                        {source.status === "syncing" && (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
                        {source.status.charAt(0).toUpperCase() +
                          source.status.slice(1)}
                      </Badge>
                    </div>
                    <Button className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>File Upload</CardTitle>
              <CardDescription>
                Upload Excel, CSV, or JSON files for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-slate-900">
                    Drag and drop your files here
                  </p>
                  <p className="text-slate-600">or click to browse</p>
                </div>
                <Input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleFileUpload}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    className="mt-4 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    disabled={isUploading}
                  >
                    {isUploading
                      ? `Uploading... ${uploadProgress}%`
                      : "Choose File"}
                  </Button>
                </label>
              </div>

              {selectedFile && (
                <Card className="bg-slate-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-slate-600">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800">
                        <Check className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    </div>
                    {isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataConnectivity;
