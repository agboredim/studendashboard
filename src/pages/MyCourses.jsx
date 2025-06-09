"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/portal/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  GraduationCap,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function MyCourses() {
  // const baseUrl = import.meta.env.VITE_BASE_URL;
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.auth.user?.id);
  //   console.log(currentUserId);

  const {
    data: enrolledData,
    isLoading,
    error,
  } = useGetEnrolledCoursesQuery(currentUserId);
  console.log(enrolledData);

  // Extract courses from the enrolled data
  const enrolledCourses = enrolledData?.course || [];

  // Calculate progress for demo purposes (in a real app, this would come from the API)
  const getRandomProgress = (courseId) => {
    // make the course id a string
    courseId = String(courseId);
    console.log(courseId);
    // Use the course ID to generate a consistent progress value
    const hash = courseId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 101; // 0-100
  };

  // Filter courses based on active tab
  const filteredCourses = enrolledCourses.filter((course) => {
    const progress = getRandomProgress(course.id);

    if (activeTab === "in-progress") {
      return progress > 0 && progress < 100;
    } else if (activeTab === "not-started") {
      return progress === 0;
    } else if (activeTab === "completed") {
      return progress === 100;
    }
    return true;
  });

  const handleStartCourse = (courseId) => {
    navigate(`/portal/learn/${courseId}`);
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
                  const progress = getRandomProgress(course.id);
                  return (
                    <Card key={course.id}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="relative h-40 md:w-64 bg-muted">
                            <img
                              // src={`${baseUrl}${course.course_image}`}
                              src={course.course_image}
                              alt={course.name}
                              className="h-full w-full object-cover"
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
                                {course.category?.name.charAt(0).toUpperCase() +
                                  course.category?.name.slice(1)}
                              </Badge>
                              <Badge variant="outline">
                                {course.level.charAt(0).toUpperCase() +
                                  course.level.slice(1)}
                              </Badge>
                            </div>

                            <h3 className="text-xl font-bold">{course.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {course.instructor?.first_name}{" "}
                              {course.instructor?.last_name}
                            </p>

                            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <BookOpenIcon className="h-4 w-4 mr-1" />
                                {course.curriculum?.reduce(
                                  (total, module) =>
                                    total + (module.video?.length || 0),
                                  0
                                ) || 0}{" "}
                                lessons
                              </div>
                              <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {course.estimated_time}
                              </div>
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                Enrolled: {new Date().toLocaleDateString()}
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
