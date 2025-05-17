"use client";

import { useState } from "react";
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
import { useGetAllAssignmentsQuery } from "@/services/coursesApi";
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

export default function Assignments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("due-date");

  // Fetch assignments using the existing API hook
  const {
    data: assignments,
    isLoading,
    error,
    refetch,
  } = useGetAllAssignmentsQuery();

  // Filter assignments based on search term, and status filter
  const filteredAssignments = assignments
    ? assignments
        .filter((assignment) => {
          // Filter by search term
          if (
            searchTerm &&
            !assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return false;
          }

          // Filter by status
          if (statusFilter === "pending") {
            return !isPast(new Date(assignment.due_date));
          } else if (statusFilter === "overdue") {
            return isPast(new Date(assignment.due_date));
          }

          return true;
        })
        .sort((a, b) => {
          // Sort assignments
          if (sortBy === "due-date") {
            return new Date(a.due_date) - new Date(b.due_date);
          } else if (sortBy === "title") {
            return a.title.localeCompare(b.title);
          } else if (sortBy === "marks") {
            return b.total_marks - a.total_marks;
          }
          return 0;
        })
    : [];

  const handleDownloadAssignment = (assignment) => {
    if (!assignment.file) {
      toast({
        title: "No file available",
        description: "This assignment doesn't have a downloadable file.",
        variant: "destructive",
      });
      return;
    }

    // Logic to download the assignment file
    window.open(assignment.file, "_blank");
  };

  const handleSubmitAssignment = (assignmentId) => {
    // Navigate to submission page
    navigate(`/portal/assignments/${assignmentId}/submit`);
  };

  const getStatusBadge = (dueDate) => {
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

  const getTeacherInitials = (teacher) => {
    return teacher
      ? `${teacher.first_name?.[0] || ""}${teacher.last_name?.[0] || ""}`
      : "TO";
  };

  const formatDueDate = (dueDate) => {
    try {
      const date = new Date(dueDate);
      return {
        formatted: format(date, "MMM d, yyyy 'at' h:mm a"),
        relative: formatDistanceToNow(date, { addSuffix: true }),
      };
    } catch (error) {
      return {
        formatted: "Invalid date",
        relative: "Unknown",
      };
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
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

        {/* Status filters */}
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

        {/* Assignments List */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading state
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
            // Error state
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
            // Empty state
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
            // Assignments list
            filteredAssignments.map((assignment) => {
              const dueDate = formatDueDate(assignment.due_date);

              // Get course name - in a real implementation, you might need to fetch this
              const courseName = "Course name not available";

              return (
                <Card key={assignment.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {assignment.title}
                        </CardTitle>
                        <CardDescription>Course: {courseName}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(assignment.due_date)}
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

                    <Button
                      size="sm"
                      onClick={() => handleSubmitAssignment(assignment.id)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </Button>
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
