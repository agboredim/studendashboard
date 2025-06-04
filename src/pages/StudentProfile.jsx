"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/portal/layout";
import { useSelector } from "react-redux";
import { useGetEnrolledCoursesQuery } from "@/services/coursesApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpenIcon,
  ClockIcon,
  GraduationCapIcon,
  CalendarIcon,
  TrophyIcon,
  PlayIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  BookIcon,
  BarChart3Icon,
  CheckCircleIcon,
  BellIcon,
  SettingsIcon,
  FileTextIcon,
  CreditCardIcon,
} from "lucide-react";

export default function StudentProfile() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Get current user from Redux store
  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id;

  // Fetch enrolled courses data
  const {
    data: studentData,
    isLoading,
    error,
  } = useGetEnrolledCoursesQuery(currentUserId);

  // Extract courses from the enrolled data
  const enrolledCourses = studentData?.course || [];

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!enrolledCourses.length) return 0;

    const totalProgress = enrolledCourses.reduce((acc, course) => {
      return acc + getRandomProgress(course.id);
    }, 0);

    return Math.round(totalProgress / enrolledCourses.length);
  };

  // Mock function to generate progress (in a real app, this would come from the API)
  const getRandomProgress = (courseId) => {
    // Make the course id a string
    courseId = String(courseId);
    // Use the course ID to generate a consistent progress value
    const hash = courseId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 101; // 0-100
  };

  // Get completed courses count
  const getCompletedCoursesCount = () => {
    return enrolledCourses.filter(
      (course) => getRandomProgress(course.id) === 100
    ).length;
  };

  // Get in-progress courses count
  const getInProgressCoursesCount = () => {
    return enrolledCourses.filter((course) => {
      const progress = getRandomProgress(course.id);
      return progress > 0 && progress < 100;
    }).length;
  };

  // Get not started courses count
  //   const getNotStartedCoursesCount = () => {
  //     return enrolledCourses.filter(
  //       (course) => getRandomProgress(course.id) === 0
  //     ).length;
  //   };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle course navigation
  const handleStartCourse = (courseId) => {
    navigate(`/portal/learn/${courseId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-48 w-full md:w-1/3 rounded-lg" />
            <Skeleton className="h-48 w-full md:w-2/3 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-xl font-bold text-red-500 mb-2">
            Error loading profile
          </h3>
          <p className="text-muted-foreground mb-6">
            We couldn't load your profile information
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Card */}
          <Card className="w-full md:w-1/3">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt={studentData?.first_name}
                  />
                  <AvatarFallback className="text-2xl">
                    {studentData?.first_name?.[0]}
                    {studentData?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">
                  {studentData?.first_name} {studentData?.last_name}
                </h2>
                <Badge className="mt-2">{studentData?.role}</Badge>
                <div className="flex items-center mt-4 text-muted-foreground">
                  <MailIcon className="h-4 w-4 mr-2" />
                  <span>{studentData?.email}</span>
                </div>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  <span>{studentData?.phone_number}</span>
                </div>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span>@{studentData?.username}</span>
                </div>
                <div className="mt-6 w-full">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/portal/settings")}
                  >
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Your overall course completion and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      Overall Progress
                    </span>
                    <span className="text-sm font-medium">
                      {calculateOverallProgress()}%
                    </span>
                  </div>
                  <Progress
                    value={calculateOverallProgress()}
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">
                      {enrolledCourses.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Courses
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">
                      {getCompletedCoursesCount()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completed
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold">
                      {getInProgressCoursesCount()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      In Progress
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>Last login: {formatDate(new Date())}</span>
                  </div>
                  <Button onClick={() => navigate("/portal/library")}>
                    Browse Courses
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="settings" className="hidden md:inline-flex">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Learning Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <ClockIcon className="h-6 w-6 mr-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {Math.floor(Math.random() * 100)} hrs
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total time spent learning
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BookOpenIcon className="h-6 w-6 mr-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {Math.floor(Math.random() * 50)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Lessons completed across all courses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrophyIcon className="h-6 w-6 mr-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {Math.floor(Math.random() * 10)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Badges and achievements earned
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest learning activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrolledCourses.slice(0, 3).map((course, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 pb-4 border-b last:border-0"
                    >
                      <div className="bg-muted rounded-full p-2">
                        {index === 0 ? (
                          <PlayIcon className="h-4 w-4" />
                        ) : index === 1 ? (
                          <BookIcon className="h-4 w-4" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">
                          {index === 0
                            ? "Watched a lesson"
                            : index === 1
                            ? "Downloaded course materials"
                            : "Completed a module"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {course.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(
                            Date.now() - index * 24 * 60 * 60 * 1000
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartCourse(course._id)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Stay on track with your course schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                {enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledCourses.slice(0, 2).map((course, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between pb-4 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-muted/50 h-10 w-10 rounded-md flex items-center justify-center">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">
                              {index === 0
                                ? "Module Assessment"
                                : "Final Project"}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {course.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {new Date(
                              Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {index === 0 ? "3 days left" : "1 week left"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      No upcoming deadlines
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>My Enrolled Courses</CardTitle>
                    <CardDescription>
                      All courses you're currently enrolled in
                    </CardDescription>
                  </div>
                  <Button onClick={() => navigate("/portal/my-courses")}>
                    View All Courses
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {enrolledCourses.length > 0 ? (
                  <div className="space-y-6">
                    {enrolledCourses.map((course, index) => {
                      const progress = getRandomProgress(course.id);
                      return (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row gap-4 pb-6 border-b last:border-0"
                        >
                          <div className="relative h-40 md:h-24 md:w-40 bg-muted rounded-md overflow-hidden">
                            <img
                              src={`${baseUrl}${course.course_image}`}
                              alt={course.name}
                              className="h-full w-full object-cover"
                            />
                            {progress === 100 && (
                              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                <CheckCircleIcon className="h-8 w-8 text-green-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
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
                            <h3 className="text-lg font-medium">
                              {course.name}
                            </h3>
                            <div className="flex items-center gap-4 my-2 text-sm text-muted-foreground">
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
                            </div>
                            <div className="mt-2">
                              <div className="flex justify-between mb-1">
                                <span className="text-xs text-muted-foreground">
                                  Progress
                                </span>
                                <span className="text-xs font-medium">
                                  {progress}%
                                </span>
                              </div>
                              <Progress value={progress} className="h-1.5" />
                            </div>
                          </div>
                          <div className="flex md:flex-col justify-between items-end gap-2 mt-2 md:mt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartCourse(course._id)}
                            >
                              {progress === 0
                                ? "Start"
                                : progress === 100
                                ? "Review"
                                : "Continue"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/portal/course/${course._id}`)
                              }
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No courses found</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't enrolled in any courses yet
                    </p>
                    <Button onClick={() => navigate("/portal/library")}>
                      Browse Course Library
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended For You</CardTitle>
                <CardDescription>
                  Based on your interests and current courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 p-3 border rounded-lg"
                    >
                      <div className="h-16 w-16 bg-muted rounded-md flex-shrink-0">
                        <img
                          src="/placeholder.svg"
                          alt="Course thumbnail"
                          className="h-full w-full object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">
                          {item === 1
                            ? "Advanced Data Analysis"
                            : "Financial Modeling"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item === 1 ? "Software Skills" : "Finance"}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-6 p-0 mt-1"
                        >
                          View Course
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Badges and milestones you've earned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "First Course",
                    "Fast Learner",
                    "Perfect Score",
                    "Consistent Learner",
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center p-4 border rounded-lg"
                    >
                      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                        <TrophyIcon className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="text-sm font-medium">{achievement}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {index === 0
                          ? "Completed your first course"
                          : index === 1
                          ? "Completed a course in record time"
                          : index === 2
                          ? "Scored 100% on an assessment"
                          : "Studied for 7 days in a row"}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        {index === 0 || index === 3 ? "Unlocked" : "Locked"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Streak</CardTitle>
                <CardDescription>Your daily learning activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold">3 Days</div>
                    <p className="text-sm text-muted-foreground">
                      Current streak
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">7 Days</div>
                    <p className="text-sm text-muted-foreground">
                      Longest streak
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array(7)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`h-10 w-10 rounded-md flex items-center justify-center ${
                            index < 3
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {index < 3 ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            ""
                          )}
                        </div>
                        <span className="text-xs mt-1">
                          {new Date(
                            Date.now() - (6 - index) * 24 * 60 * 60 * 1000
                          ).toLocaleDateString(undefined, { weekday: "short" })}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Certificates</CardTitle>
                <CardDescription>
                  Certificates you've earned from completed courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getCompletedCoursesCount() > 0 ? (
                  <div className="space-y-4">
                    {enrolledCourses
                      .filter((course) => getRandomProgress(course.id) === 100)
                      .map((course, index) => (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg"
                        >
                          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <GraduationCapIcon className="h-8 w-8 text-primary" />
                          </div>
                          <div className="flex-1 text-center md:text-left">
                            <h4 className="font-medium">{course.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Issued on{" "}
                              {formatDate(
                                new Date(
                                  Date.now() -
                                    Math.random() * 30 * 24 * 60 * 60 * 1000
                                )
                              )}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <FileTextIcon className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <GraduationCapIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No certificates yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Complete a course to earn your first certificate
                    </p>
                    <Button onClick={() => navigate("/portal/my-courses")}>
                      Continue Learning
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={studentData?.first_name || ""}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={studentData?.last_name || ""}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={studentData?.email || ""}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        value={studentData?.phone_number || ""}
                        readOnly
                      />
                    </div>
                  </div>
                  <Button variant="outline">Edit Profile</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Notification Preferences
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">
                          Email Notifications
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Receive course updates via email
                        </p>
                      </div>
                      <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                        <div className="h-5 w-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">
                          SMS Notifications
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Receive course updates via SMS
                        </p>
                      </div>
                      <div className="h-6 w-11 bg-muted rounded-full relative cursor-pointer">
                        <div className="h-5 w-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Information</h3>
                  <div className="flex items-center gap-3 p-3 border rounded-md">
                    <CreditCardIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-muted-foreground">
                        Expires 12/25
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
