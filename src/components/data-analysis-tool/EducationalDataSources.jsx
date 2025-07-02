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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  FileText,
  Link,
  Check,
  AlertCircle,
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  Info,
  Download,
  Eye,
  Play,
} from "lucide-react";
import {
  selectDataSources,
  selectActiveAssignment,
  selectCurrentAssignmentDataSource,
  selectConnectedDataSource,
  selectAssignments,
  connectDataSource,
  disconnectDataSource,
} from "@/store/slices/educationalDataAnalysisSlice";

const EducationalDataSources = () => {
  const dispatch = useDispatch();
  const dataSources = useSelector(selectDataSources);
  const activeAssignment = useSelector(selectActiveAssignment);
  const connectedDataSource = useSelector(selectConnectedDataSource);
  const currentAssignmentDataSource = useSelector(
    selectCurrentAssignmentDataSource
  );
  const assignments = useSelector(selectAssignments);

  const handleConnectDataSource = (dataSourceId) => {
    dispatch(connectDataSource(dataSourceId));
  };

  const handleDisconnectDataSource = () => {
    dispatch(disconnectDataSource());
  };

  const getDataSourceIcon = (type) => {
    switch (type.toLowerCase()) {
      case "csv":
        return FileText;
      case "json":
        return Database;
      case "api":
        return Link;
      default:
        return FileText;
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get assignment-specific data sources
  const assignmentDataSources = activeAssignment
    ? dataSources.filter((ds) => ds.assignmentIds.includes(activeAssignment))
    : [];

  // Get all available data sources for exploration
  const allDataSources = dataSources;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Data Sources</h2>
          <p className="text-slate-600">
            Connect to instructor-provided datasets for your assignments
          </p>
        </div>

        {/* Current Connection Status */}
        {connectedDataSource && (
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800">
              <Check className="w-3 h-3 mr-1" />
              Connected
            </Badge>
            <Button
              variant="outline"
              onClick={handleDisconnectDataSource}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Disconnect
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="assignment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white rounded-lg shadow-sm border">
          <TabsTrigger value="assignment">Assignment Data</TabsTrigger>
          <TabsTrigger value="available">All Available</TabsTrigger>
          <TabsTrigger value="guides">Connection Guides</TabsTrigger>
        </TabsList>

        {/* Assignment-Specific Data Sources */}
        <TabsContent value="assignment" className="space-y-6">
          {activeAssignment ? (
            <>
              {/* Current Assignment Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-blue-900">
                        Working on:{" "}
                        {
                          assignments.find((a) => a.id === activeAssignment)
                            ?.title
                        }
                      </h3>
                      <p className="text-sm text-blue-700">
                        Required data source for this assignment
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment Data Source */}
              {currentAssignmentDataSource ? (
                <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const Icon = getDataSourceIcon(
                            currentAssignmentDataSource.type
                          );
                          return <Icon className="w-8 h-8 text-blue-600" />;
                        })()}
                        <div>
                          <CardTitle className="text-xl">
                            {currentAssignmentDataSource.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {currentAssignmentDataSource.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        className={getComplexityColor(
                          currentAssignmentDataSource.complexity
                        )}
                      >
                        {currentAssignmentDataSource.complexity}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Data Source Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <p className="font-medium">
                          {currentAssignmentDataSource.type}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Records:</span>
                        <p className="font-medium">
                          {currentAssignmentDataSource.records.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Size:</span>
                        <p className="font-medium">
                          {currentAssignmentDataSource.size}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Updated:</span>
                        <p className="font-medium">
                          {new Date(
                            currentAssignmentDataSource.lastUpdated
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Column Preview */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">
                        Data Columns:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentAssignmentDataSource.columns.map(
                          (column, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {column}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">
                        <span className="text-gray-600">Provided by:</span>
                        <span className="font-medium ml-1">
                          {currentAssignmentDataSource.instructor}
                        </span>
                      </span>
                    </div>

                    {/* Connection Actions */}
                    <div className="flex gap-3 pt-2">
                      {connectedDataSource ===
                      currentAssignmentDataSource.id ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="font-medium">Connected & Ready</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() =>
                            handleConnectDataSource(
                              currentAssignmentDataSource.id
                            )
                          }
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Connect to Data Source
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="border border-slate-300"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Data
                      </Button>

                      <Button
                        variant="outline"
                        className="border border-slate-300"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Sample
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Data Source Found
                    </h3>
                    <p className="text-gray-600">
                      The instructor hasn't provided a data source for this
                      assignment yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Active Assignment
                </h3>
                <p className="text-gray-600">
                  Select an assignment from the Assignments tab to see its
                  required data sources.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* All Available Data Sources */}
        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allDataSources.map((dataSource) => {
              const Icon = getDataSourceIcon(dataSource.type);
              const isConnected = connectedDataSource === dataSource.id;

              return (
                <Card
                  key={dataSource.id}
                  className={`hover:shadow-lg transition-all cursor-pointer ${
                    isConnected ? "border-2 border-green-300 bg-green-50" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Icon className="w-6 h-6 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg">
                            {dataSource.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {dataSource.instructor}
                          </CardDescription>
                        </div>
                      </div>
                      {isConnected && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">
                      {dataSource.description}
                    </p>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{dataSource.records.toLocaleString()} records</span>
                      <span>{dataSource.size}</span>
                    </div>

                    <Badge
                      className={getComplexityColor(dataSource.complexity)}
                    >
                      {dataSource.complexity}
                    </Badge>

                    <div className="pt-2">
                      {isConnected ? (
                        <Button
                          variant="outline"
                          className="w-full border-green-300 text-green-700 hover:bg-green-100"
                          disabled
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Connected
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleConnectDataSource(dataSource.id)}
                          className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Connection Guides */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CSV Guide */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-600" />
                  <CardTitle>CSV Files</CardTitle>
                </div>
                <CardDescription>
                  Learn how to work with comma-separated values files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>What is CSV?</strong> A simple format for tabular
                    data
                  </p>
                  <p>
                    <strong>Best for:</strong> Structured data with rows and
                    columns
                  </p>
                  <p>
                    <strong>File size:</strong> Usually smaller than Excel files
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  <Info className="w-4 h-4 mr-2" />
                  View CSV Tutorial
                </Button>
              </CardContent>
            </Card>

            {/* JSON Guide */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="w-6 h-6 text-blue-600" />
                  <CardTitle>JSON Files</CardTitle>
                </div>
                <CardDescription>
                  Understanding JavaScript Object Notation data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>What is JSON?</strong> Structured data in key-value
                    format
                  </p>
                  <p>
                    <strong>Best for:</strong> Nested and hierarchical data
                  </p>
                  <p>
                    <strong>Common use:</strong> API responses and web data
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  <Info className="w-4 h-4 mr-2" />
                  View JSON Tutorial
                </Button>
              </CardContent>
            </Card>

            {/* API Guide */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Link className="w-6 h-6 text-purple-600" />
                  <CardTitle>API Connections</CardTitle>
                </div>
                <CardDescription>
                  Connecting to live data sources via APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>What are APIs?</strong> Live data feeds from web
                    services
                  </p>
                  <p>
                    <strong>Best for:</strong> Real-time and frequently updated
                    data
                  </p>
                  <p>
                    <strong>Examples:</strong> Social media, weather, stock
                    prices
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  <Info className="w-4 h-4 mr-2" />
                  View API Tutorial
                </Button>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                  <CardTitle>Best Practices</CardTitle>
                </div>
                <CardDescription>
                  Tips for working with data sources effectively
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <p>• Always preview data before connecting</p>
                  <p>• Check data quality and completeness</p>
                  <p>• Understand column meanings and formats</p>
                  <p>• Note any missing or unusual values</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Info className="w-4 h-4 mr-2" />
                  View Full Guide
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationalDataSources;
