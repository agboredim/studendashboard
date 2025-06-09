"use client";

import { Progress } from "@/components/ui/progress";

import { useState } from "react";
import { useSelector } from "react-redux";
import Layout from "@/components/portal/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Calendar,
  Clock,
  ExternalLink,
  PlayCircle,
  Target,
  Users,
  BookOpen,
  FileText,
  Video,
} from "lucide-react";

// Import dashboard components
import CourseProgressCard from "@/components/dashboard/course-progress-card";
import DeadlineCard from "@/components/dashboard/deadline-card";
import ProgressOverview from "@/components/dashboard/progress-overview";
import AttendanceChart from "@/components/dashboard/attendance-chart";
import ActivityTimeline from "@/components/dashboard/activity-timeline";
import CertificateCard from "@/components/dashboard/certificate-card";
import UpcomingClassCard from "@/components/dashboard/upcoming-class-card";
import StatCard from "@/components/dashboard/stat-card";
import LearningTimeChart from "@/components/dashboard/learning-time-chart";

// Mock data - will be replaced with API calls
import {
  mockUser,
  mockEnrollments,
  mockDeadlines,
  mockCertificates,
  mockUpcomingClasses,
  mockAttendanceData,
  mockActivityData,
  mockLearningTimeData,
  mockStats,
  mockProgressDetails,
} from "@/data/dashboard-mock-data";
import { useGetEnrolledCoursesQuery } from "@/services/coursesApi";
import CourseProgressDetail from "@/components/dashboard/course-progress-detail";

export default function Dashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("week");
  const { user: authUser } = useSelector((state) => state.auth);
  const currentUserId = useSelector((state) => state.auth.user?.id);
  console.log(authUser, currentUserId);

  const {
    data: enrolledData,
    isLoading,
    error,
  } = useGetEnrolledCoursesQuery(currentUserId);
  const enrolledCourses = enrolledData?.course || [];

  // These would be API calls in the future
  // const { data: user, isLoading: isUserLoading } = useGetMeQuery()
  // const { data: enrollments, isLoading: isEnrollmentsLoading } = useGetEnrollmentsQuery()
  // const { data: deadlines, isLoading: isDeadlinesLoading } = useGetDeadlinesQuery()
  // const { data: certificates, isLoading: isCertificatesLoading } = useGetCertificatesQuery()
  // const { data: upcomingClasses, isLoading: isClassesLoading } = useGetUpcomingClassesQuery()
  // const { data: attendanceData, isLoading: isAttendanceLoading } = useGetAttendanceDataQuery(timeRange)
  // const { data: activityData, isLoading: isActivityLoading } = useGetActivityDataQuery()
  // const { data: learningTimeData, isLoading: isLearningTimeLoading } = useGetLearningTimeDataQuery(timeRange)
  // const { data: stats, isLoading: isStatsLoading } = useGetStatsQuery()

  // Use mock data instead
  const user = authUser || mockUser;
  // mockEnrollments
  const enrollments = enrolledCourses || [];
  const deadlines = mockDeadlines;
  const certificates = mockCertificates;
  const upcomingClasses = mockUpcomingClasses;
  const attendanceData = mockAttendanceData[timeRange];
  const activityData = mockActivityData;
  const learningTimeData = mockLearningTimeData[timeRange];
  const stats = mockStats;

  // Loading states
  const isUserLoading = false;
  const isEnrollmentsLoading = false;
  const isDeadlinesLoading = false;
  const isCertificatesLoading = false;
  const isClassesLoading = false;
  const isAttendanceLoading = false;
  const isActivityLoading = false;
  const isLearningTimeLoading = false;
  const isStatsLoading = false;

  // Calculate overall progress
  const totalProgress =
    enrollments.reduce((acc, enrollment) => acc + enrollment.progress, 0) || 0;
  const averageProgress = enrollments.length
    ? Math.round(totalProgress / enrollments.length)
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <section>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {isUserLoading ? (
                      <Skeleton className="h-8 w-48" />
                    ) : (
                      `Welcome back, ${
                        user?.first_name || user.first_name === ""
                          ? user.username
                          : user.first_name || user?.last_name || "Student"
                      }`
                    )}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Here's an overview of your learning progress and upcoming
                    activities.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/portal/enroll-courses")}
                  >
                    Browse Courses
                  </Button>
                  <Button onClick={() => navigate("/portal/courses")}>
                    My Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isStatsLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-8 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))
          ) : (
            <>
              <StatCard
                title="Course Completion"
                value={`${stats.completionRate}%`}
                description="Overall completion rate"
                trend={stats.completionTrend}
                icon={<Target className="h-5 w-5" />}
                color="blue"
              />
              <StatCard
                title="Class Attendance"
                value={`${stats.attendanceRate}%`}
                description="Average attendance rate"
                trend={stats.attendanceTrend}
                icon={<Users className="h-5 w-5" />}
                color="green"
              />
              <StatCard
                title="Learning Hours"
                value={stats.learningHours}
                description="Total hours this month"
                trend={stats.learningHoursTrend}
                icon={<Clock className="h-5 w-5" />}
                color="purple"
              />
              <StatCard
                title="Certificates"
                value={stats.certificatesEarned}
                description="Certificates earned"
                trend={stats.certificatesTrend}
                icon={<Award className="h-5 w-5" />}
                color="amber"
              />
            </>
          )}
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Course Progress & Deadlines */}
          <div className="lg:col-span-2 space-y-6">
            {/* In Progress Courses */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Courses In Progress</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/portal/library")}
                  >
                    View All <ExternalLink className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isEnrollmentsLoading
                  ? Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <Card
                          key={i}
                          className="border-none shadow-none bg-muted/40"
                        >
                          <CardContent className="p-4">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-4 w-24 mb-3" />
                            <Skeleton className="h-2 w-full mb-2" />
                            <Skeleton className="h-3 w-12 ml-auto mb-3" />
                            <Skeleton className="h-9 w-full" />
                          </CardContent>
                        </Card>
                      ))
                  : enrollments
                      ?.filter((e) => !e.progress > 0 && !e.progress < 100)
                      .slice(0, 4)
                      .map((enrollment) => (
                        <CourseProgressCard
                          key={enrollment.id}
                          id={enrollment.id}
                          title={enrollment.name}
                          instructor={enrollment.instructor?.first_name}
                          progress={enrollment.progress ?? 0}
                          lastActivity={enrollment.lastActivity}
                          thumbnail={enrollment.course_image}
                          nextLesson={enrollment.nextLesson}
                        />
                      ))}
              </CardContent>

              {enrollments?.filter((e) => !e.progress > 0 && !e.progress < 100)
                .length === 0 && (
                <CardContent className="text-center py-6">
                  <p className="text-muted-foreground">
                    You don't have any courses in progress.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate("/portal/library")}
                  >
                    Browse Courses
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Detailed Course Progress */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Course Progress Details</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/portal/progress")}
                  >
                    View Analytics <ExternalLink className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Track your progress across all materials
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {isEnrollmentsLoading ? (
                  Array(2)
                    .fill(0)
                    .map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                ) : (
                  // <>
                  //   {Object.keys(mockProgressDetails)
                  //     .slice(0, 2)
                  //     .map((courseId) => {
                  //       const progressDetail = mockProgressDetails[courseId];
                  //       return (
                  //         <div key={courseId} className="p-4 border rounded-lg">
                  //           <div className="flex justify-between items-center mb-2">
                  //             <h3 className="font-medium">
                  //               {progressDetail.course_name}
                  //             </h3>
                  //             <span className="text-sm font-medium">
                  //               {progressDetail.progress_percentage}% Complete
                  //             </span>
                  //           </div>
                  //           <Progress
                  //             value={progressDetail.progress_percentage}
                  //             className="h-2 mb-4"
                  //           />
                  //           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  //             <div className="flex items-center gap-2">
                  //               <Video className="h-4 w-4 text-blue-500" />
                  //               <span>
                  //                 Videos:{" "}
                  //                 {progressDetail.details.videos.completed}/
                  //                 {progressDetail.details.videos.total}
                  //               </span>
                  //             </div>
                  //             <div className="flex items-center gap-2">
                  //               <FileText className="h-4 w-4 text-green-500" />
                  //               <span>
                  //                 Notes:{" "}
                  //                 {progressDetail.details.course_notes.opened}/
                  //                 {progressDetail.details.course_notes.total}
                  //               </span>
                  //             </div>
                  //             <div className="flex items-center gap-2">
                  //               <BookOpen className="h-4 w-4 text-amber-500" />
                  //               <span>
                  //                 Assignments:{" "}
                  //                 {progressDetail.details.assignments.submitted}
                  //                 /{progressDetail.details.assignments.total}
                  //               </span>
                  //             </div>
                  //             <div className="flex items-center gap-2">
                  //               <FileText className="h-4 w-4 text-purple-500" />
                  //               <span>
                  //                 PDFs:{" "}
                  //                 {progressDetail.details.blog_pdfs.viewed}/
                  //                 {progressDetail.details.blog_pdfs.total}
                  //               </span>
                  //             </div>
                  //           </div>
                  //         </div>
                  //       );
                  //     })}
                  //   <div className="text-center mt-2">
                  //     <Button
                  //       variant="outline"
                  //       size="sm"
                  //       onClick={() => navigate("/portal/progress")}
                  //     >
                  //       View All Course Progress
                  //     </Button>
                  //   </div>
                  // </>
                  <>
                    {enrollments.map((course) => (
                      <CourseProgressDetail
                        key={course.id}
                        courseId={course.id}
                        courseName={course.name}
                        courseImage={course.course_image}
                      />
                    ))}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Learning Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Learning Activity</CardTitle>
                  <Tabs
                    defaultValue="week"
                    value={timeRange}
                    onValueChange={setTimeRange}
                  >
                    <TabsList className="grid w-[240px] grid-cols-3">
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="month">Month</TabsTrigger>
                      <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                {isLearningTimeLoading ? (
                  <Skeleton className="h-[240px] w-full" />
                ) : (
                  <LearningTimeChart data={learningTimeData} />
                )}
              </CardContent>
            </Card>

            {/* Upcoming Deadlines & Classes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {isDeadlinesLoading ? (
                    Array(2)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex">
                          <Skeleton className="h-16 w-16 rounded-md" />
                          <div className="ml-4 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                        </div>
                      ))
                  ) : deadlines && deadlines.length > 0 ? (
                    deadlines.map((deadline) => (
                      <DeadlineCard
                        key={deadline.id}
                        title={deadline.title}
                        description={deadline.description}
                        dueDate={new Date(deadline.dueDate)}
                        type={deadline.type}
                        courseId={deadline.courseId}
                        courseName={deadline.courseName}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No upcoming deadlines
                      </p>
                    </div>
                  )}
                </CardContent>

                {deadlines && deadlines.length > 0 && (
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Deadlines
                    </Button>
                  </CardFooter>
                )}
              </Card>

              {/* Upcoming Live Classes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PlayCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                    Upcoming Live Classes
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {isClassesLoading ? (
                    Array(2)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex">
                          <Skeleton className="h-16 w-16 rounded-md" />
                          <div className="ml-4 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                        </div>
                      ))
                  ) : upcomingClasses && upcomingClasses.length > 0 ? (
                    upcomingClasses.map((classItem) => (
                      <UpcomingClassCard
                        key={classItem.id}
                        id={classItem.id}
                        title={classItem.title}
                        instructor={classItem.instructor}
                        startTime={new Date(classItem.startTime)}
                        duration={classItem.duration}
                        courseId={classItem.courseId}
                        courseName={classItem.courseName}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No upcoming live classes
                      </p>
                    </div>
                  )}
                </CardContent>

                {upcomingClasses && upcomingClasses.length > 0 && (
                  <CardFooter>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate("/portal/live-classes")}
                    >
                      View All Classes
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>

          {/* Right Column - Progress & Achievements */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
              </CardHeader>

              <CardContent>
                {isEnrollmentsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                  </div>
                ) : (
                  <ProgressOverview
                    overallProgress={averageProgress}
                    enrolledCourses={enrollments.length}
                    completedCourses={
                      enrollments.filter((e) => e.progress === 100).length
                    }
                    inProgressCourses={
                      enrollments.filter(
                        (e) => e.progress > 0 && e.progress < 100
                      ).length
                    }
                    notStartedCourses={
                      enrollments.filter((e) => e.progress === 0).length
                    }
                  />
                )}
              </CardContent>
            </Card>

            {/* Class Attendance */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Class Attendance</CardTitle>
                  <Tabs
                    defaultValue="week"
                    value={timeRange}
                    onValueChange={setTimeRange}
                    className="hidden sm:block"
                  >
                    <TabsList className="grid w-[180px] grid-cols-3">
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="month">Month</TabsTrigger>
                      <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>

              <CardContent>
                {isAttendanceLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <AttendanceChart data={attendanceData} />
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>

              <CardContent>
                {isActivityLoading ? (
                  Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-start space-y-2 mb-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="ml-3 space-y-1 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))
                ) : (
                  <ActivityTimeline activities={activityData} />
                )}
              </CardContent>

              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>

            {/* Certificates */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Certificates</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {isCertificatesLoading ? (
                  Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))
                ) : certificates && certificates.length > 0 ? (
                  certificates
                    .slice(0, 3)
                    .map((certificate) => (
                      <CertificateCard
                        key={certificate.id}
                        id={certificate.id}
                        title={certificate.title}
                        issueDate={new Date(certificate.issueDate)}
                        courseId={certificate.courseId}
                        courseName={certificate.courseName}
                      />
                    ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Complete courses to earn certificates
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/portal/certificates")}
                >
                  View All Certificates
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
