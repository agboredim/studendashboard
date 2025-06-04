"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/portal/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetEnrolledCoursesQuery } from "@/services/coursesApi";
import {
  GraduationCapIcon,
  SearchIcon,
  AwardIcon,
  CalendarIcon,
  BookOpenIcon,
  FilterIcon,
  DownloadIcon,
  TrendingUpIcon,
  CheckCircleIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import CertificateDownloadButton from "@/components/certificate-download-button";

export default function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.auth.user?.id);
  const currentUser = useSelector((state) => state.auth.user);

  const {
    data: enrolledData,
    isLoading,
    error,
  } = useGetEnrolledCoursesQuery(currentUserId);

  // Extract courses from the enrolled data
  const enrolledCourses = enrolledData?.course || [];

  // Calculate progress for demo purposes (in a real app, this would come from the API)
  const getRandomProgress = (courseId) => {
    courseId = String(courseId);
    const hash = courseId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 101; // 0-100
  };

  // Filter for completed courses only
  //   const completedCourses = enrolledCourses.filter((course) => {
  //     const progress = getRandomProgress(course.id);
  //     const isCompleted = progress === 100;
  //     const matchesSearch =
  //       course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       course.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

  //     return isCompleted && matchesSearch;
  //   });
  const completedCourses = enrolledCourses;

  const totalCertificates = completedCourses.length;
  const recentCertificates = completedCourses.slice(0, 3);

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              Unable to Load Certificates
            </h2>
            <p className="text-gray-600 mt-2">
              There was an error loading your certificates. Please try again.
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-yellow-500 p-2 rounded-lg">
                <GraduationCapIcon className="h-8 w-8 text-white" />
              </div>
              My Certificates
            </h1>
            <p className="text-muted-foreground mt-2">
              Download and manage your course completion certificates
            </p>
          </div>
          <Button onClick={() => navigate("/portal/courses")}>
            View All Courses
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Certificates
              </CardTitle>
              <AwardIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCertificates}</div>
              <p className="text-xs text-muted-foreground">
                Available for download
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Courses Completed
              </CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedCourses.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of {enrolledCourses.length} enrolled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Downloads
              </CardTitle>
              <DownloadIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recentCertificates.length}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search certificates by course name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Certificates Grid */}
        {completedCourses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <AwardIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm
                  ? "No certificates found"
                  : "No certificates available"}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {searchTerm
                  ? "Try adjusting your search terms or filter criteria."
                  : "Complete some courses to earn your first certificate!"}
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate("/portal/courses")}>
                  Browse Courses
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {completedCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-r from-blue-600 to-yellow-500 p-3 rounded-lg">
                          <BookOpenIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">
                            {course.name}
                          </h3>
                          <p className="text-gray-600 mb-2 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <BookOpenIcon className="h-4 w-4" />
                              <span>{course.category?.name || "General"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>
                                Completed: {new Date().toLocaleDateString()}
                              </span>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                            >
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <CertificateDownloadButton
                        course={course}
                        showPreview={true}
                        variant="default"
                      />
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/portal/courses/${course.id}`)}
                      >
                        View Course
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {completedCourses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Download all certificates logic would go here
                    console.log("Download all certificates");
                  }}
                  className="flex items-center gap-2"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Download All Certificates
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/portal/courses")}
                  className="flex items-center gap-2"
                >
                  <BookOpenIcon className="h-4 w-4" />
                  Explore More Courses
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/portal/progress")}
                  className="flex items-center gap-2"
                >
                  <TrendingUpIcon className="h-4 w-4" />
                  View Learning Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
