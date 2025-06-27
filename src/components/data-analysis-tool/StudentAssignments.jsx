// components/data-analysis-tool/StudentAssignments.jsx
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
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  Play,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  FileText,
} from "lucide-react";
import {
  selectFilteredAssignments,
  selectStudentProgress,
  selectAssignmentStats,
  selectFilters,
  setActiveAssignment,
  updateFilter,
  clearFilters,
} from "@/store/slices/educationalDataAnalysisSlice";

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

const StudentAssignments = () => {
  const dispatch = useDispatch();
  const assignments = useSelector(selectFilteredAssignments);
  const studentProgress = useSelector(selectStudentProgress);
  const assignmentStats = useSelector(selectAssignmentStats);
  const filters = useSelector(selectFilters);

  const handleFilterChange = (key, value) => {
    dispatch(updateFilter({ key, value }));
  };

  const handleStartAssignment = (assignmentId) => {
    dispatch(setActiveAssignment(assignmentId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "graded":
        return "bg-green-100 text-green-800";
      case "not_started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "bg-emerald-100 text-emerald-800";
      case "intermediate":
        return "bg-orange-100 text-orange-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Student Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Assignments
            </CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {assignmentStats.active}
            </div>
            <p className="text-xs text-gray-500">
              {assignmentStats.total - assignmentStats.active} completed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <Award className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {studentProgress.averageGrade}%
            </div>
            <p className="text-xs text-gray-500">
              {studentProgress.completedAssignments} assignments graded
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {studentProgress.currentStreak}
            </div>
            <p className="text-xs text-gray-500">days in a row</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {studentProgress.timeSpent}h
            </div>
            <p className="text-xs text-gray-500">this semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="min-w-48">
              <Select
                value={filters.assignmentStatus}
                onValueChange={(value) =>
                  handleFilterChange("assignmentStatus", value)
                }
              >
                <SelectItem value="all">All Assignments</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="active">In Progress</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
              </Select>
            </div>

            <div className="min-w-48">
              <Select
                value={filters.difficulty}
                onValueChange={(value) =>
                  handleFilterChange("difficulty", value)
                }
              >
                <SelectItem value="all">All Difficulty Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </Select>
            </div>

            <div className="min-w-48">
              <Select
                value={filters.instructor}
                onValueChange={(value) =>
                  handleFilterChange("instructor", value)
                }
              >
                <SelectItem value="all">All Instructors</SelectItem>
                <SelectItem value="Dr. Sarah Johnson">
                  Dr. Sarah Johnson
                </SelectItem>
                <SelectItem value="Prof. Michael Chen">
                  Prof. Michael Chen
                </SelectItem>
              </Select>
            </div>

            <Button
              onClick={() => dispatch(clearFilters())}
              className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assignments.map((assignment) => {
          const daysUntilDue = getDaysUntilDue(assignment.dueDate);
          const isOverdue = daysUntilDue < 0;
          const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

          return (
            <Card
              key={assignment.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {assignment.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 mb-3">
                      {assignment.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      className={getDifficultyColor(assignment.difficulty)}
                    >
                      {assignment.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Assignment Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{assignment.instructor}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      isOverdue
                        ? "text-red-600"
                        : isDueSoon
                        ? "text-orange-600"
                        : "text-gray-600"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>
                      {isOverdue
                        ? `${Math.abs(daysUntilDue)} days overdue`
                        : isDueSoon
                        ? `Due in ${daysUntilDue} days`
                        : `Due ${new Date(
                            assignment.dueDate
                          ).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {assignment.status !== "not_started" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{assignment.progress}%</span>
                    </div>
                    <Progress value={assignment.progress} className="w-full" />
                  </div>
                )}

                {/* Requirements Preview */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Requirements ({assignment.requirements.length})
                  </h4>
                  <div className="space-y-1">
                    {assignment.requirements.slice(0, 2).map((req, index) => (
                      <div
                        key={index}
                        className="text-xs text-gray-600 flex items-center gap-2"
                      >
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        {req}
                      </div>
                    ))}
                    {assignment.requirements.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{assignment.requirements.length - 2} more requirements
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {assignment.status === "not_started" ? (
                    <Button
                      onClick={() => handleStartAssignment(assignment.id)}
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Assignment
                    </Button>
                  ) : assignment.status === "active" ? (
                    <Button
                      onClick={() => handleStartAssignment(assignment.id)}
                      className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Continue Working
                    </Button>
                  ) : assignment.status === "submitted" ? (
                    <Button
                      disabled
                      className="flex-1 bg-yellow-100 text-yellow-800 cursor-not-allowed"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Awaiting Grade
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleStartAssignment(assignment.id)}
                      className="flex-1 bg-green-600 text-white hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      View Results
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>

                {/* Grade Display */}
                {assignment.grade && (
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Grade:</span>
                      <Badge className="bg-green-100 text-green-800">
                        {assignment.grade}%
                      </Badge>
                    </div>
                    {assignment.feedback && (
                      <p className="text-xs text-gray-600 mt-1">
                        {assignment.feedback}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Skills Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Development</CardTitle>
          <CardDescription>
            Track your data analysis learning progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studentProgress.skillsLearned.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">{skill}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* No assignments message */}
      {assignments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No assignments found
            </h3>
            <p className="text-gray-600">
              {Object.values(filters).some((f) => f !== "all")
                ? "Try adjusting your filters to see more assignments."
                : "Your instructor hasn't assigned any projects yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentAssignments;
