"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGetAssignmentByIdQuery } from "@/services/coursesApi";
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
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch assignment details using the existing API hook
  const { data: assignment, isLoading, error } = useGetAssignmentByIdQuery(id);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (limit to 10MB)
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

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a file for your assignment submission",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would implement the actual submission logic
      // For example, using a mutation from your API service
      // const formData = new FormData()
      // formData.append('file', file)
      // formData.append('comment', comment)
      // await submitAssignment({ assignmentId: id, formData }).unwrap()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Assignment submitted",
        description: "Your assignment has been submitted successfully",
      });

      // Navigate back to assignments page
      navigate("/portal/assignments");
    } catch (error) {
      toast({
        title: "Submission failed",
        description:
          "There was a problem submitting your assignment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDueDate = (dueDate) => {
    try {
      return format(new Date(dueDate), "MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get course name - in a real implementation, you might need to fetch this
  const courseName = "Course name not available";

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

        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-red-200">
            <CardContent className="pt-6 pb-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">
                Error loading assignment
              </h3>
              <p className="text-muted-foreground mb-4">
                There was a problem fetching the assignment details. Please try
                again.
              </p>
              <Button onClick={() => navigate("/portal/assignments")}>
                Back to Assignments
              </Button>
            </CardContent>
          </Card>
        ) : assignment ? (
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
                  Upload your completed assignment and add any comments for your
                  instructor
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="comment">Comments (Optional)</Label>
                    <Textarea
                      id="comment"
                      placeholder="Add any comments or notes about your submission..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                    />
                  </div>

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
                        >
                          Select File
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                          onChange={handleFileChange}
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
                  <Button type="submit" disabled={!file || isSubmitting}>
                    {isSubmitting ? (
                      <>Submitting...</>
                    ) : (
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
        ) : (
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
      </div>
    </Layout>
  );
}
