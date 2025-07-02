// components/data-analysis-tool/EducationalDataModeling.jsx
import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  Link2,
  Filter,
  Wand2,
  CheckCircle,
  AlertCircle,
  Info,
  Play,
  Lightbulb,
  Target,
  BookOpen,
  Settings,
  Save,
  Eye,
  RefreshCw,
} from "lucide-react";
import {
  selectActiveAssignment,
  selectCurrentAssignmentDataSource,
  selectStudentWork,
  saveDataModel,
  autoSave,
} from "@/store/slices/educationalDataAnalysisSlice";

const EducationalDataModeling = () => {
  const dispatch = useDispatch();
  const activeAssignment = useSelector(selectActiveAssignment);
  const dataSource = useSelector(selectCurrentAssignmentDataSource);
  const studentWork = useSelector(selectStudentWork);

  const [currentStep, setCurrentStep] = useState(1);
  const [modelingProgress, setModelingProgress] = useState(0);
  const [selectedTables, setSelectedTables] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [transformations, setTransformations] = useState([]);

  // Guided modeling steps
  const modelingSteps = [
    {
      id: 1,
      title: "Understand Your Data",
      description: "Explore and understand the structure of your dataset",
      icon: Eye,
      color: "blue",
    },
    {
      id: 2,
      title: "Clean & Transform",
      description: "Remove inconsistencies and prepare data for analysis",
      icon: RefreshCw,
      color: "emerald",
    },
    {
      id: 3,
      title: "Define Relationships",
      description: "Connect related data fields and tables",
      icon: Link2,
      color: "purple",
    },
    {
      id: 4,
      title: "Validate Model",
      description: "Check your data model meets assignment requirements",
      icon: CheckCircle,
      color: "green",
    },
  ];

  // Sample data columns with issues to fix (educational)
  const sampleColumns = [
    {
      name: "customer_id",
      type: "Integer",
      issues: [],
      quality: "excellent",
      suggestions: [],
    },
    {
      name: "customer_name",
      type: "String",
      issues: ["Missing values (5%)", "Inconsistent capitalization"],
      quality: "good",
      suggestions: ["Standardize name format", "Handle missing values"],
    },
    {
      name: "email",
      type: "String",
      issues: ["Invalid email formats (12 records)"],
      quality: "fair",
      suggestions: ["Validate email addresses", "Remove invalid entries"],
    },
    {
      name: "purchase_date",
      type: "Date",
      issues: ["Multiple date formats", "Future dates found"],
      quality: "poor",
      suggestions: ["Standardize date format", "Validate date ranges"],
    },
    {
      name: "amount",
      type: "Decimal",
      issues: ["Negative values", "Outliers detected"],
      quality: "good",
      suggestions: ["Review negative amounts", "Handle outliers"],
    },
  ];

  const getQualityColor = (quality) => {
    switch (quality) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStepComplete = (stepId) => {
    const newProgress = Math.min(modelingProgress + 25, 100);
    setModelingProgress(newProgress);

    // Auto-save progress
    const modelData = {
      step: stepId,
      progress: newProgress,
      tables: selectedTables,
      relationships,
      transformations,
      lastUpdated: new Date().toISOString(),
    };

    dispatch(saveDataModel(modelData));

    if (stepId < modelingSteps.length) {
      setCurrentStep(stepId + 1);
    }
  };

  const handleSaveModel = () => {
    const modelData = {
      step: currentStep,
      progress: modelingProgress,
      tables: selectedTables,
      relationships,
      transformations,
      lastUpdated: new Date().toISOString(),
    };

    dispatch(saveDataModel(modelData));
    dispatch(autoSave());
  };

  if (!activeAssignment) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Database className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Active Assignment
          </h3>
          <p className="text-gray-600">
            Select an assignment to start data modeling exercises.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!dataSource) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Data Source Connected
          </h3>
          <p className="text-gray-600">
            Connect to a data source first from the Data Sources tab.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Data Modeling Studio
          </h2>
          <p className="text-slate-600">
            Learn to structure and prepare your data for analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSaveModel}>
            <Save className="w-4 h-4 mr-2" />
            Save Progress
          </Button>
          <Badge className="bg-blue-100 text-blue-800">
            Step {currentStep} of {modelingSteps.length}
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-blue-900">Overall Progress</h3>
            <span className="text-blue-700 font-medium">
              {modelingProgress}% Complete
            </span>
          </div>
          <Progress value={modelingProgress} className="w-full mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modelingSteps.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    isCompleted
                      ? "bg-green-100"
                      : isCurrent
                      ? "bg-blue-100"
                      : "bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isCompleted
                        ? "text-green-600"
                        : isCurrent
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isCompleted
                        ? "text-green-800"
                        : isCurrent
                        ? "text-blue-800"
                        : "text-gray-600"
                    }`}
                  >
                    {step.title}
                  </span>
                  {isCompleted && (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="guided" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white rounded-lg shadow-sm border">
          <TabsTrigger value="guided">Guided Learning</TabsTrigger>
          <TabsTrigger value="explorer">Data Explorer</TabsTrigger>
          <TabsTrigger value="validator">Model Validator</TabsTrigger>
        </TabsList>

        {/* Guided Learning Mode */}
        <TabsContent value="guided" className="space-y-6">
          {/* Current Step Instructions */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = modelingSteps[currentStep - 1]?.icon || BookOpen;
                  return <Icon className="w-6 h-6 text-blue-600" />;
                })()}
                <div>
                  <CardTitle>
                    Step {currentStep}: {modelingSteps[currentStep - 1]?.title}
                  </CardTitle>
                  <CardDescription>
                    {modelingSteps[currentStep - 1]?.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Step 1: Data Understanding */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Data Source Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {dataSource.records.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-600">Records</div>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600">
                        {dataSource.columns.length}
                      </div>
                      <div className="text-sm text-emerald-600">Columns</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {dataSource.size}
                      </div>
                      <div className="text-sm text-orange-600">File Size</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {dataSource.type}
                      </div>
                      <div className="text-sm text-purple-600">Format</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Data Columns:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {dataSource.columns.map((column, index) => (
                        <Badge key={index} variant="outline">
                          {column}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleStepComplete(1)}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />I understand the
                    data structure
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Data Cleaning */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Data Quality Assessment
                  </CardTitle>
                  <CardDescription>
                    Identify and fix data quality issues before analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {sampleColumns.map((column, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{column.name}</h4>
                            <p className="text-sm text-gray-600">
                              {column.type}
                            </p>
                          </div>
                          <Badge className={getQualityColor(column.quality)}>
                            {column.quality}
                          </Badge>
                        </div>

                        {column.issues.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-red-600">
                              Issues Found:
                            </h5>
                            {column.issues.map((issue, issueIndex) => (
                              <div
                                key={issueIndex}
                                className="text-sm text-red-600 flex items-center gap-2"
                              >
                                <AlertCircle className="w-3 h-3" />
                                {issue}
                              </div>
                            ))}
                          </div>
                        )}

                        {column.suggestions.length > 0 && (
                          <div className="space-y-2 mt-2">
                            <h5 className="text-sm font-medium text-blue-600">
                              Suggested Fixes:
                            </h5>
                            {column.suggestions.map(
                              (suggestion, suggestionIndex) => (
                                <div
                                  key={suggestionIndex}
                                  className="text-sm text-blue-600 flex items-center gap-2"
                                >
                                  <Lightbulb className="w-3 h-3" />
                                  {suggestion}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleStepComplete(2)}
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Apply data cleaning transformations
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Relationships */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="w-5 h-5" />
                    Define Data Relationships
                  </CardTitle>
                  <CardDescription>
                    Connect related fields to enable meaningful analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Learning Tip
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Relationships help connect data across different tables or
                      within the same table. For example, customer_id in
                      different tables should reference the same customer.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Suggested Relationships:</h4>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Customer ↔ Orders</p>
                          <p className="text-sm text-gray-600">
                            Link customers to their orders via customer_id
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Link2 className="w-3 h-3 mr-1" />
                          Create
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Orders ↔ Products</p>
                          <p className="text-sm text-gray-600">
                            Connect orders to products via product_id
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Link2 className="w-3 h-3 mr-1" />
                          Create
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleStepComplete(3)}
                    className="w-full bg-purple-600 text-white hover:bg-purple-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Relationships defined successfully
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Validation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Model Validation
                  </CardTitle>
                  <CardDescription>
                    Verify your data model meets assignment requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800">
                        Data structure understood
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800">
                        Data quality issues addressed
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800">
                        Relationships defined
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        Model Complete!
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your data model is ready for visualization and analysis.
                      You can now proceed to create charts and dashboards.
                    </p>
                  </div>

                  <Button
                    onClick={() => handleStepComplete(4)}
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete data modeling
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Data Explorer Tab */}
        <TabsContent value="explorer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Explorer</CardTitle>
              <CardDescription>Explore your data in detail</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Database className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Interactive data exploration coming soon
                </p>
                <p className="text-sm text-gray-500">
                  View sample data, column statistics, and data types
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Model Validator Tab */}
        <TabsContent value="validator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Validator</CardTitle>
              <CardDescription>
                Check if your model meets assignment requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Model validation tools coming soon
                </p>
                <p className="text-sm text-gray-500">
                  Automated checks against assignment criteria
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationalDataModeling;
