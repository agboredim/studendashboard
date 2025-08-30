"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/portal/layout";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import {
  useGetAssignmentByIdQuery,
  useSubmitAssignmentMutation,
} from "@/services/coursesApi";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { format } from "date-fns";

export default function AssignmentSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    data: assignment,
    isLoading,
    error,
    refetch,
  } = useGetAssignmentByIdQuery(id);
  const [submitAssignment] = useSubmitAssignmentMutation();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => setFile(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assignment?.id) {
      toast({
        title: "Invalid assignment",
        description: "Assignment ID is missing. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to submit.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Build FormData manually
      const formData = new FormData();
      formData.append("assignment_id", assignment.id); // backend expects assignment_id
      formData.append("file", file);

      // 👀 Debug: log form data contents
      console.group("📤 Submitting Assignment");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      console.groupEnd();

      // ✅ Call the mutation
      await submitAssignment({
        assignment: assignment.id, // still pass assignment for cache invalidation
        file,
        courseId: assignment.course,
        formData, // <-- pass our built formData
      }).unwrap();

      toast({
        title: "Success",
        description: "Assignment submitted successfully",
        duration: 3000,
      });

      setFile(null);
      setSubmitted(true);
    } catch (err) {
      console.error("❌ Submission error:", err);

      let description = "Please try again.";
      if (err?.data) {
        if (typeof err.data === "string") {
          description = err.data;
        } else {
          description = Object.entries(err.data)
            .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
            .join("\n");
        }
      }

      toast({
        title: "Submission failed",
        description,
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDueDate = (dueDate) => {
    try {
      return format(new Date(dueDate), "MMMM d, yyyy 'at' h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  const courseName = assignment?.course_title || "Course name not available";

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/portal/assignments")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Assignments
          </Button>
        </div>

        {/* Skeleton loader */}
        {isLoading && (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200">
            <CardContent className="pt-6 pb-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">
                Error loading assignment
              </h3>
              <p className="text-muted-foreground mb-4">
                There was a problem fetching the assignment details.
              </p>
              <div className="flex justify-center gap-2">
                <Button onClick={() => refetch()}>Retry</Button>
                <Button onClick={() => navigate("/portal/assignments")}>
                  Back to Assignments
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Not Found */}
        {!isLoading && !error && !assignment && (
          <Card>
            <CardContent className="pt-6 pb-6 text-center">
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">Assignment not found</h3>
              <p className="text-muted-foreground mb-4">
                The assignment you're looking for doesn't exist or has been
                removed.
              </p>
              <Button onClick={() => navigate("/portal/assignments")}>
                Back to Assignments
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Assignment Details + Submission Form */}
        {assignment && (
          <>
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-xl">
                      {assignment.title}
                    </CardTitle>
                    <CardDescription>Course: {courseName}</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 self-start md:self-auto"
                  >
                    {assignment.total_marks} marks
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Assignment Description</h3>
                  <p>{assignment.description}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {formatDueDate(assignment.due_date)}</span>
                </div>

                {assignment.file && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Assignment Instructions
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Download the file for detailed instructions
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(assignment.file, "_blank")}
                    >
                      Download
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submit Your Assignment</CardTitle>
                <CardDescription>
                  Upload your completed assignment
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file">Upload File</Label>
                    {file ? (
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          disabled={isSubmitting || submitted}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-md p-6 text-center">
                        <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-1">
                          Drag and drop your file here
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Supports PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX up to
                          10MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("file-upload").click()
                          }
                          disabled={isSubmitting || submitted}
                        >
                          Select File
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                          onChange={handleFileChange}
                          disabled={isSubmitting || submitted}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/portal/assignments")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting || submitted}>
                    {isSubmitting
                      ? "Submitting..."
                      : submitted
                      ? "Submitted"
                      : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Assignment
                        </>
                        )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
