"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/portal/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGetEnrolledCoursesQuery } from "@/services/coursesApi";
import {
  PlayIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
} from "lucide-react";
import { useSelector } from "react-redux";

const placeholderImg = "/placeholder.png"; // ✅ Correct name

export default function MyCourses() {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.auth.user?.id);
  const [failedImages, setFailedImages] = useState({});
  const [loadingImages, setLoadingImages] = useState({});

  const {
    data: enrolledData,
    isLoading,
    error,
  } = useGetEnrolledCoursesQuery(currentUserId);

  const enrolledCourses = enrolledData?.course || [];

  useEffect(() => {
    if (enrolledData) {
      console.log("Enrolled Courses API Response:", enrolledData);
    }
  }, [enrolledData]);

  const getRandomProgress = (courseId) => {
    if (!courseId) return 0;
    const hash = String(courseId)
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 101;
  };

  const filteredCourses = enrolledCourses.filter((course) => {
    const progress = getRandomProgress(course?.id);
    if (activeTab === "in-progress") return progress > 0 && progress < 100;
    if (activeTab === "not-started") return progress === 0;
    if (activeTab === "completed") return progress === 100;
    return true;
  });

  const handleStartCourse = (courseId) => {
    navigate(`/portal/learn/${courseId}`);
  };

  const getCourseImage = (course) => {
    const rawImg = course?.course_image || course?.image || "";
    return rawImg
      ? (rawImg.startsWith("http")
          ? rawImg
          : `${import.meta.env.VITE_BASE_URL}${rawImg}`)
      : placeholderImg;
  };

  const handleImgError = (id) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleImgLoadStart = (id) => {
    setLoadingImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleImgLoad = (id) => {
    setLoadingImages((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <Button onClick={() => navigate("/portal/library")}>
            Browse More Courses
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="not-started">Not Started</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="grid gap-6">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <Skeleton className="h-40 w-full md:w-64" />
                          <div className="p-6 flex-1">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <Skeleton className="h-2 w-full mb-2" />
                            <div className="flex justify-between mt-4">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-9 w-32" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-red-500">
                  Error loading your courses
                </h3>
                <p className="text-muted-foreground mb-4">
                  Please try again later
                </p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid gap-6">
                {filteredCourses.map((course) => {
                  const progress = getRandomProgress(course?.id);
                  const categoryName = course?.category?.name || "General";
                  const levelName = course?.level || "Beginner";
                  const instructorName = course?.instructor
                    ? `${course.instructor.first_name || ""} ${
                        course.instructor.last_name || ""
                      }`.trim()
                    : "No instructor";
                  const imgSrc = failedImages[course.id]
                    ? placeholderImg
                    : getCourseImage(course);

                  return (
                    <Card key={course.id}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="relative ml-3 mt-5 h-48 md:w-64 bg-muted overflow-hidden rounded-lg">
                            {loadingImages[course.id] && (
                              <Skeleton className="absolute inset-0" />
                            )}
                            <img
                              src={imgSrc}
                              alt={course?.name || "Course image"}
                              className={`h-full w-full object-cover transform hover:scale-105 transition-transform duration-500 ${
                                loadingImages[course.id] ? "opacity-0" : "opacity-100"
                              }`}
                              onError={() => handleImgError(course.id)}
                              onLoadStart={() => handleImgLoadStart(course.id)}
                              onLoad={() => handleImgLoad(course.id)}
                            />
                            {progress === 100 && (
                              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                <CheckCircleIcon className="h-12 w-12 text-green-500" />
                              </div>
                            )}
                          </div>
                          <div className="p-6 flex-1">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="outline" className="bg-muted/50">
                                {categoryName.charAt(0).toUpperCase() +
                                  categoryName.slice(1)}
                              </Badge>
                              <Badge variant="outline">
                                {levelName.charAt(0).toUpperCase() +
                                  levelName.slice(1)}
                              </Badge>
                            </div>

                            <h3 className="text-xl font-bold">
                              {course?.name || "Untitled Course"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {instructorName}
                            </p>

                            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <BookOpenIcon className="h-4 w-4 mr-1" />
                                {course?.curriculum?.reduce(
                                  (total, module) =>
                                    total + (module?.video?.length || 0),
                                  0
                                ) || 0}{" "}
                                lessons
                              </div>
                              <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {course?.estimated_time || "N/A"}
                              </div>
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                Enrolled:{" "}
                                {course?.enrolled_date
                                  ? new Date(
                                      course.enrolled_date
                                    ).toLocaleDateString()
                                  : new Date().toLocaleDateString()}
                              </div>
                            </div>

                            <Progress value={progress} className="h-2 mb-2" />

                            <div className="flex justify-between items-center mt-4">
                              <span className="text-sm font-medium">
                                {progress}% Complete
                              </span>
                              <Button
                                onClick={() => handleStartCourse(course.id)}
                              >
                                <PlayIcon className="h-4 w-4 mr-2" />
                                {progress === 0
                                  ? "Start Course"
                                  : progress === 100
                                  ? "Review Course"
                                  : "Continue Learning"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No courses found</h3>
                <p className="text-muted-foreground mb-6">
                  {activeTab === "in-progress"
                    ? "You don't have any courses in progress"
                    : activeTab === "not-started"
                    ? "You don't have any courses that haven't been started"
                    : activeTab === "completed"
                    ? "You haven't completed any courses yet"
                    : "You haven't enrolled in any courses yet"}
                </p>
                <Button onClick={() => navigate("/portal/library")}>
                  Browse Course Library
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
