import Layout from "@/components/portal/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressCard from "@/components/portal/progress-card";
import DeadlineCard from "@/components/portal/deadline-card";
import CircularProgress from "@/components/portal/circular-progress";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data
const mockUser = { name: "Joseph" };
const mockEnrollments = [
  { id: 1, course: { title: "Cyber Security" }, progress: 50 },
  { id: 2, course: { title: "Data Science" }, progress: 70 },
  { id: 3, course: { title: "Web Development" }, progress: 30 },
];
const mockDeadlines = [
  {
    id: 1,
    title: "Project Plan Submission",
    description: "Submit your project plan for the final assignment",
    dueDate: new Date(2025, 3, 25), // April 25, 2025
    type: "assignment",
  },
  {
    id: 2,
    title: "Case Study Analysis",
    description: "Complete the case study analysis for module 4",
    dueDate: new Date(2025, 3, 28), // April 28, 2025
    type: "assignment",
  },
];

export default function Dashboard() {
  // Commented out API calls
  // const { data: user, isLoading: isUserLoading } = useGetMeQuery();
  // const { data: enrollments, isLoading: isEnrollmentsLoading } = useGetEnrollmentsQuery();
  // const { data: deadlines, isLoading: isDeadlinesLoading } = useGetDeadlinesQuery();

  // Use mock data instead
  const user = mockUser;
  const enrollments = mockEnrollments;
  const deadlines = mockDeadlines;

  // Calculate overall progress
  const totalProgress =
    enrollments.reduce((acc, enrollment) => acc + enrollment.progress, 0) || 0;

  const averageProgress = enrollments.length
    ? Math.round(totalProgress / enrollments.length)
    : 0;

  const isUserLoading = false;
  const isEnrollmentsLoading = false;
  const isDeadlinesLoading = false;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <section>
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold">
                {isUserLoading ? (
                  <Skeleton className="h-8 w-48" />
                ) : (
                  `Welcome Back ${user?.username || "Joseph"}`
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                Continue your learning journey with one of your current Courses.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {isEnrollmentsLoading
                  ? Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <Card key={i} className="bg-blue-50 border-none">
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
                      ?.slice(0, 3)
                      .map((enrollment) => (
                        <ProgressCard
                          key={enrollment.id}
                          title={enrollment.course?.title || "Cyber Security"}
                          progress={enrollment.progress || 30}
                        />
                      ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Deadlines */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
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
                    />
                  ))
                ) : (
                  <>
                    <DeadlineCard
                      title="Project Plan Submission"
                      description="Submit your project plan for the final assignment"
                      dueDate={new Date(2025, 3, 25)}
                      type="assignment"
                    />
                    <DeadlineCard
                      title="Case Study Analysis"
                      description="Complete the case study analysis for module 4"
                      dueDate={new Date(2025, 3, 28)}
                      type="assignment"
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col items-center">
                {isEnrollmentsLoading ? (
                  <Skeleton className="h-32 w-32 rounded-full" />
                ) : (
                  <CircularProgress
                    value={averageProgress || 60}
                    label={`${averageProgress || 60}%`}
                    secondaryLabel="Completion"
                  />
                )}

                <div className="mt-4 text-center">
                  <p className="font-semibold">Enrolled</p>
                  {isEnrollmentsLoading ? (
                    <div className="text-sm text-muted-foreground">
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {(enrollments?.length || 2) + " Courses"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Achievements & Certificates */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Certificates</CardTitle>
              </CardHeader>

              <CardContent className="text-center">
                <div className="text-sm text-muted-foreground mb-4">
                  Go to Settings to activate Windows
                </div>
                <Button variant="outline" className="rounded-full">
                  View All Certificates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
