"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/portal/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  Download,
  FileText,
  Filter,
  Search,
  Upload,
  AlertCircle,
  X,
} from "lucide-react";
import { format, isPast, formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { useGetAssignmentsForStudentCourseQuery } from "@/services/coursesApi";

export default function Assignments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("due-date");

  const currentUser = useSelector(selectCurrentUser);

  // ✅ safely extract first enrolled course ID
  const courseId = currentUser?.course?.[0]?.id;

  // ✅ Fetch assignments for user + course
  const {
    data: assignments = [],
    isLoading,
    error,
    refetch,
  } = useGetAssignmentsForStudentCourseQuery(
    { userId: currentUser?.id, courseId },
    { skip: !currentUser?.id || !courseId }
  );

  // 🔍 Debug logs
  useEffect(() => {
    console.log("👤 Current User:", currentUser);
    console.log("📚 Course ID:", courseId);
    console.log("🎯 Raw Assignments API result:", assignments);
    console.log("⏳ Loading:", isLoading, "❌ Error:", error);
  }, [assignments, currentUser, courseId, isLoading, error]);

  // 🔹 Apply filtering: only show assignments for enrolled courses & assigned to this user
  const filteredAssignments = assignments
    .filter((assignment) => {
      // ✅ Check if assignment belongs to one of user's enrolled courses
      const isUserCourse = currentUser?.course?.some(
        (c) => c.id === assignment.course?.id
      );

      // ✅ Check if explicitly assigned to user (if backend sends assigned_to field)
      const isAssignedToUser = assignment.assigned_to
        ? assignment.assigned_to.includes(currentUser?.id)
        : true;

      return isUserCourse && isAssignedToUser;
    })
    .filter((assignment) => {
      // ✅ Apply search filter
      if (
        searchTerm &&
        !assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      // ✅ Apply status filter
      if (statusFilter === "pending") {
        return !isPast(new Date(assignment.due_date));
      } else if (statusFilter === "overdue") {
        return isPast(new Date(assignment.due_date));
      }
      return true;
    })
    .sort((a, b) => {
      // ✅ Sorting
      if (sortBy === "due-date") {
        return new Date(a.due_date) - new Date(b.due_date);
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "marks") {
        return b.total_marks - a.total_marks;
      }
      return 0;
    });

  useEffect(() => {
    console.log("📋 Filtered Assignments:", filteredAssignments);
  }, [filteredAssignments]);

  const handleDownloadAssignment = (assignment) => {
    if (!assignment.file) {
      toast({
        title: "No file available",
        description: "This assignment doesn't have a downloadable file.",
        variant: "destructive",
      });
      return;
    }
    window.open(assignment.file, "_blank");
  };

  const handleSubmitAssignment = (assignmentId) => {
    navigate(`/portal/assignments/${assignmentId}/submit`);
  };

  const getStatusBadge = (dueDate, submitted) => {
    if (submitted) {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
        >
          ✅ Submitted
        </Badge>
      );
    }
    const isOverdue = isPast(new Date(dueDate));
    if (isOverdue) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Overdue
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200"
      >
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    );
  };

  const getTeacherInitials = (teacher) =>
    teacher
      ? `${teacher.first_name?.[0] || ""}${teacher.last_name?.[0] || ""}`
      : "TO";

  const formatDueDate = (dueDate) => {
    try {
      const date = new Date(dueDate);
      return {
        formatted: format(date, "MMM d, yyyy 'at' h:mm a"),
        relative: formatDistanceToNow(date, { addSuffix: true }),
      };
    } catch {
      return { formatted: "Invalid date", relative: "Unknown" };
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* 🔹 Header + Search + Filters */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold">Assignments</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assignments..."
                className="pl-8 w-full md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Assignments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("overdue")}>
                  Overdue
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("due-date")}>
                  Due Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("title")}>
                  Title
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("marks")}>
                  Total Marks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 🔹 Status Pills */}
        <div className="flex flex-wrap gap-2">
          {statusFilter !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status:{" "}
              {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <button
                className="ml-1 rounded-full hover:bg-muted p-0.5"
                onClick={() => setStatusFilter("all")}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {sortBy !== "due-date" && (
            <Badge variant="outline" className="flex items-center gap-1">
              Sort:{" "}
              {sortBy === "title"
                ? "Title"
                : sortBy === "marks"
                ? "Total Marks"
                : "Due Date"}
              <button
                className="ml-1 rounded-full hover:bg-muted p-0.5"
                onClick={() => setSortBy("due-date")}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>

        {/* 🔹 Assignments List */}
        <div className="space-y-4">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-64" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-10 w-28" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : error ? (
            <Card className="border-red-200">
              <CardContent className="pt-6 pb-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">
                  Error loading assignments
                </h3>
                <p className="text-muted-foreground mb-4">
                  There was a problem fetching your assignments. Please try
                  again.
                </p>
                <Button onClick={() => refetch()}>Retry</Button>
              </CardContent>
            </Card>
          ) : filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">
                  No assignments found
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? `No assignments match "${searchTerm}"`
                    : statusFilter !== "all"
                    ? `No ${statusFilter} assignments found`
                    : "You don't have any assignments yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAssignments.map((assignment) => {
              const dueDate = formatDueDate(assignment.due_date);

              return (
                <Card key={assignment.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {assignment.title}
                        </CardTitle>
                        <CardDescription>
                          Course: {assignment.course?.title || "N/A"}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(
                          assignment.due_date,
                          assignment.submitted
                        )}
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {assignment.total_marks} marks
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm mb-4">{assignment.description}</p>

                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              assignment.teacher?.profile_picture ||
                              "/placeholder.svg"
                            }
                            alt={`${assignment.teacher?.first_name} ${assignment.teacher?.last_name}`}
                          />
                          <AvatarFallback>
                            {getTeacherInitials(assignment.teacher)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {assignment.teacher?.first_name}{" "}
                            {assignment.teacher?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {assignment.teacher?.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <span title={dueDate.formatted}>
                            Due {dueDate.relative}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadAssignment(assignment)}
                      disabled={!assignment.file}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {assignment.file ? "Download" : "No file"}
                    </Button>

                    {!assignment.submitted && (
                      <Button
                        size="sm"
                        onClick={() => handleSubmitAssignment(assignment.id)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Assignment
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
