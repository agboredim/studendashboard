import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/hooks/use-toast";

// Using papaparse for better CSV parsing
import Papa from "papaparse";

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

const initialConnectedSources = [
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

export const DataConnectivity = ({ onDataImported }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [connectedSources, setConnectedSources] = useState(
    initialConnectedSources
  );
  const { toast } = useToast();

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);

    try {
      // Use papaparse for better CSV parsing
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(), // Clean headers
        complete: (results) => {
          console.log("CSV Parse Results:", results);

          if (results.errors.length > 0) {
            console.warn("CSV Parse Errors:", results.errors);
          }

          const headers = results.meta.fields || [];
          const data = results.data || [];

          // Filter out completely empty rows
          const cleanData = data.filter((row) =>
            Object.values(row).some(
              (value) => value && value.toString().trim() !== ""
            )
          );

          console.log("Processed Data:", {
            headers,
            dataCount: cleanData.length,
            sampleRow: cleanData[0],
          });

          // Simulate processing delay
          setTimeout(() => {
            setIsUploading(false);

            // Add to connected sources
            const newSource = {
              name: file.name.replace(".csv", ""),
              type: "CSV Import",
              lastSync: "Just now",
              records: cleanData.length.toLocaleString(),
              status: "active",
            };
            setConnectedSources((prev) => [...prev, newSource]);

            // Send processed data to parent
            if (onDataImported) {
              const importedData = {
                fileName: file.name,
                tableName: file.name
                  .replace(".csv", "")
                  .replace(/[^a-zA-Z0-9_]/g, "_"), // Clean table name
                headers: headers,
                data: cleanData,
                rowCount: cleanData.length,
                columnCount: headers.length,
              };

              console.log("Sending to parent:", importedData);
              onDataImported(importedData);
            }

            toast({
              title: "File uploaded successfully",
              description: `${file.name} processed: ${cleanData.length} rows, ${headers.length} columns`,
            });
          }, 1500);
        },
        error: (error) => {
          console.error("CSV Parse Error:", error);
          setIsUploading(false);
          toast({
            title: "Upload failed",
            description: "Failed to parse CSV file. Please check the format.",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error("File processing error:", error);
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "Failed to process the file. Please try again.",
        variant: "destructive",
      });
    }
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
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Connection
        </Button>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">File Upload</TabsTrigger>
          <TabsTrigger value="sources">Available Sources</TabsTrigger>
          <TabsTrigger value="connected">Connected Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>CSV File Upload</CardTitle>
              <CardDescription>
                Upload CSV files for data modeling and analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-slate-900">
                    {isUploading
                      ? "Processing your file..."
                      : "Drag and drop your CSV file here"}
                  </p>
                  <p className="text-slate-600">
                    {isUploading
                      ? "Please wait while we parse your data"
                      : "or click to browse"}
                  </p>
                </div>
                <Input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                  id="file-upload"
                  disabled={isUploading}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    disabled={isUploading}
                    asChild
                  >
                    <span>
                      {isUploading ? "Processing..." : "Choose CSV File"}
                    </span>
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
                      <Badge
                        variant="default"
                        className={
                          isUploading
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-emerald-100 text-emerald-800"
                        }
                      >
                        {isUploading ? (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Uploaded
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="text-center p-4">
                  <FileText className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                  <h4 className="font-medium">CSV Format</h4>
                  <p className="text-sm text-slate-600">
                    Comma-separated values
                  </p>
                </Card>
                <Card className="text-center p-4">
                  <Database className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <h4 className="font-medium">Auto-Detection</h4>
                  <p className="text-sm text-slate-600">
                    Column types detected
                  </p>
                </Card>
                <Card className="text-center p-4">
                  <Check className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                  <h4 className="font-medium">Ready to Model</h4>
                  <p className="text-sm text-slate-600">
                    Instant table creation
                  </p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataSources.map((source, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer group"
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
                    variant={
                      source.status === "connected" ? "default" : "secondary"
                    }
                    className={
                      source.status === "connected"
                        ? "bg-emerald-100 text-emerald-800"
                        : ""
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
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent"
                  >
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
                        variant={
                          source.status === "active" ? "default" : "secondary"
                        }
                        className={
                          source.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : source.status === "syncing"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
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
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
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
