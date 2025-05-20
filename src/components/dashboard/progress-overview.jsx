import { Progress } from "@/components/ui/progress"
import { BookOpenIcon, CheckCircleIcon, ClockIcon } from "lucide-react"

export default function ProgressOverview({
  overallProgress,
  enrolledCourses,
  completedCourses,
  inProgressCourses,
  notStartedCourses,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-muted-foreground/20"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - overallProgress / 100)}`}
              strokeLinecap="round"
              className="text-primary transition-all duration-500 ease-in-out"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold">{overallProgress}%</span>
            <span className="text-xs text-muted-foreground">Completion</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="font-semibold">Enrolled Courses</p>
          <p className="text-sm text-muted-foreground">{enrolledCourses} Courses</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-sm">Completed</span>
          </div>
          <span className="text-sm font-medium">{completedCourses}</span>
        </div>
        <Progress value={(completedCourses / enrolledCourses) * 100} className="h-2 bg-muted" />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
            <span className="text-sm">In Progress</span>
          </div>
          <span className="text-sm font-medium">{inProgressCourses}</span>
        </div>
        <Progress value={(inProgressCourses / enrolledCourses) * 100} className="h-2 bg-muted" />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpenIcon className="h-4 w-4 mr-2 text-orange-500" />
            <span className="text-sm">Not Started</span>
          </div>
          <span className="text-sm font-medium">{notStartedCourses}</span>
        </div>
        <Progress value={(notStartedCourses / enrolledCourses) * 100} className="h-2 bg-muted" />
      </div>
    </div>
  )
}
