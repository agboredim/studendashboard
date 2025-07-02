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
  BookOpen,
  GraduationCap,
  UserCheck,
  ToggleLeft,
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
  selectUserRole,
  selectCurrentUser,
  selectActiveAssignment,
  selectAssignmentStats,
  setActiveTab,
  switchRole,
} from "@/store/slices/educationalDataAnalysisSlice";

// Import educational components
import StudentAssignments from "@/components/data-analysis-tool/StudentAssignments";
import EducationalDataSources from "@/components/data-analysis-tool/EducationalDataSources";
import EducationalDataModeling from "@/components/data-analysis-tool/EducationalDataModeling";

const EducationalDataAnalysisTool = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectActiveTab);
  const userRole = useSelector(selectUserRole);
  const currentUser = useSelector(selectCurrentUser);
  const activeAssignment = useSelector(selectActiveAssignment);
  const assignmentStats = useSelector(selectAssignmentStats);

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const handleRoleSwitch = () => {
    const newRole = userRole === "student" ? "instructor" : "student";
    dispatch(switchRole(newRole));
  };

  // Tab configuration based on role
  const studentTabs = [
    { value: "assignments", label: "Assignments", icon: BookOpen },
    { value: "data_sources", label: "Data Sources", icon: Database },
    { value: "modeling", label: "Data Modeling", icon: FileSpreadsheet },
    { value: "visualizations", label: "Visualizations", icon: BarChart3 },
    { value: "reports", label: "Reports", icon: TrendingUp },
  ];

  const instructorTabs = [
    {
      value: "manage_assignments",
      label: "Manage Assignments",
      icon: BookOpen,
    },
    { value: "student_progress", label: "Student Progress", icon: Users },
    { value: "data_sources", label: "Data Sources", icon: Database },
    { value: "grading", label: "Grading", icon: GraduationCap },
    { value: "analytics", label: "Class Analytics", icon: BarChart3 },
  ];

  const currentTabs = userRole === "student" ? studentTabs : instructorTabs;

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
                <p className="text-sm text-slate-600">
                  Educational Data Analysis Platform
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* User Info */}
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-slate-600">{currentUser.course}</p>
                </div>
                <Badge
                  className={
                    userRole === "student"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }
                >
                  {userRole === "student" ? (
                    <>
                      <UserCheck className="w-3 h-3 mr-1" />
                      Student
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-3 h-3 mr-1" />
                      Instructor
                    </>
                  )}
                </Badge>
              </div>

              {/* Role Switch (Demo Feature) */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRoleSwitch}
                className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              >
                <ToggleLeft className="w-4 h-4 mr-2" />
                Switch Role
              </Button>

              {/* Action Buttons */}
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
        {/* Assignment Context Banner (Student Only) */}
        {userRole === "student" && activeAssignment && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-blue-900">
                      Currently Working On
                    </h3>
                    <p className="text-sm text-blue-700">
                      Assignment #{activeAssignment}
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Active</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList
            className={`grid w-full bg-white rounded-lg shadow-sm border ${
              userRole === "student" ? "grid-cols-5" : "grid-cols-5"
            }`}
          >
            {currentTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Student Interface */}
          {userRole === "student" && (
            <>
              <TabsContent value="assignments" className="space-y-6">
                <StudentAssignments />
              </TabsContent>

              <TabsContent value="data_sources" className="space-y-6">
                <EducationalDataSources />
              </TabsContent>

              <TabsContent value="modeling" className="space-y-6">
                <EducationalDataModeling />
              </TabsContent>

              <TabsContent value="visualizations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Visualization Studio</CardTitle>
                    <CardDescription>
                      Create charts and dashboards for your assignments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        Visualization Studio - Coming Soon
                      </p>
                      <p className="text-sm text-gray-500">
                        Build interactive charts, dashboards, and presentations
                        for your assignments
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Report Builder</CardTitle>
                    <CardDescription>
                      Generate analysis reports for assignment submission
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        Report Builder - Coming Soon
                      </p>
                      <p className="text-sm text-gray-500">
                        Create structured reports with findings, insights, and
                        recommendations
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}

          {/* Instructor Interface */}
          {userRole === "instructor" && (
            <>
              <TabsContent value="manage_assignments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Assignment Management</CardTitle>
                    <CardDescription>
                      Create and manage data analysis assignments for your
                      students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        Assignment Management - Coming Soon
                      </p>
                      <p className="text-sm text-gray-500">
                        Create assignments, set requirements, and provide data
                        sources
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="student_progress" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Progress</CardTitle>
                    <CardDescription>
                      Monitor student progress and provide guidance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        Progress Tracking - Coming Soon
                      </p>
                      <p className="text-sm text-gray-500">
                        View individual and class progress, identify struggling
                        students
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data_sources" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Source Library</CardTitle>
                    <CardDescription>
                      Manage educational datasets for student assignments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Database className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        Data Source Management - Coming Soon
                      </p>
                      <p className="text-sm text-gray-500">
                        Upload, organize, and assign datasets to student
                        projects
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="grading" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Grading Center</CardTitle>
                    <CardDescription>
                      Review and grade student submissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <GraduationCap className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        Grading Tools - Coming Soon
                      </p>
                      <p className="text-sm text-gray-500">
                        Review student work, provide feedback, and assign grades
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Class Analytics</CardTitle>
                    <CardDescription>
                      Analyze class performance and learning outcomes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">
                        Class Analytics - Coming Soon
                      </p>
                      <p className="text-sm text-gray-500">
                        Track learning outcomes, identify trends, and improve
                        curriculum
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default EducationalDataAnalysisTool;
