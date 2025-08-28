"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "@/components/portal/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEnrolledCoursesQuery } from "@/services/coursesApi";
import {
  BarChart,
  Calendar,
  Clock,
  GraduationCap,
  LineChart,
  PieChart,
} from "lucide-react";
import CourseProgressDetail from "@/components/dashboard/course-progress-detail";

const placeholderImg = "/placeholder.png";

export default function ProgressAnalytics() {
  const [activeTab, setActiveTab] = useState("courses");
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.auth.user?.id);

  const {
    data: enrolledData,
    isLoading,
    error,
  } = useGetEnrolledCoursesQuery(currentUserId);

  const enrolledCourses = enrolledData?.course || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold">Progress & Analytics</h1>
          <Button onClick={() => navigate("/portal/courses")}>
            View My Courses
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="courses"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="courses">Course Progress</TabsTrigger>
            <TabsTrigger value="analytics">Learning Analytics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* --- Course Progress --- */}
          <TabsContent value="courses" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
                <CardDescription>
                  Track your progress across all enrolled courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full mb-4" />
                  ))
                ) : error ? (
                  <div className="text-center py-6">
                    <p className="text-red-500">Error loading your courses</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                ) : enrolledCourses.length > 0 ? (
                  <div className="space-y-2">
                    {enrolledCourses.map((course) => (
                      <CourseProgressDetail
                        key={course.id}
                        courseId={course.id}
                        courseName={course.name}
                        courseImage={course.course_image || placeholderImg}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground mb-4">
                      You haven't enrolled in any courses yet
                    </p>
                    <Button onClick={() => navigate("/portal/library")}>
                      Browse Courses
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* --- Analytics Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Learning Activity</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">
                      Learning activity data will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">
                      Upcoming assignment deadlines will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* --- Learning Analytics --- */}
          <TabsContent value="analytics" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Time Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">
                      Learning time analytics will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance by Subject</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">
                      Subject performance data will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Streak</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">
                      Your learning streak will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* --- Achievements --- */}
          <TabsContent value="achievements" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Badges</CardTitle>
                <CardDescription>
                  Track your learning milestones and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No Achievements Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Complete courses and assignments to earn achievements and
                    badges
                  </p>
                  <Button onClick={() => navigate("/portal/courses")}>
                    Continue Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
