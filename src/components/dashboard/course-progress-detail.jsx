"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useGetCourseProgressDetailsQuery } from "@/services/coursesApi"
import { BookOpen, CheckCircle, FileText, PlayCircle, Video } from 'lucide-react'

export default function CourseProgressDetail({ courseId, courseName, courseImage }) {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    data: progressDetails,
    isLoading,
    error,
  } = useGetCourseProgressDetailsQuery(
    { userId: user?.id, courseId },
    { skip: !user?.id || !courseId }
  )

  const handleContinueLearning = () => {
    navigate(`/portal/learn/${courseId}`)
  }

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-4 border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{courseName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm">Error loading progress details</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!progressDetails) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{courseName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No progress data available</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={handleContinueLearning}>
            Start Learning
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`mb-4 overflow-hidden transition-all duration-300 ${isExpanded ? "shadow-md" : ""}`}>
      <div
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{courseName}</CardTitle>
            <Badge variant={progressDetails.progress_percentage === 100 ? "success" : "outline"}>
              {progressDetails.progress_percentage}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <Progress value={progressDetails.progress_percentage} className="h-2" />
        </CardContent>
      </div>

      {isExpanded && (
        <CardContent className="pt-0 pb-4 border-t mt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <ProgressCard
              title="Videos"
              icon={<Video className="h-5 w-5 text-blue-500" />}
              completed={progressDetails.details.videos.completed}
              total={progressDetails.details.videos.total}
              color="blue"
            />
            
            <ProgressCard
              title="Course Notes"
              icon={<FileText className="h-5 w-5 text-green-500" />}
              completed={progressDetails.details.course_notes.opened}
              total={progressDetails.details.course_notes.total}
              color="green"
            />
            
            <ProgressCard
              title="Assignments"
              icon={<BookOpen className="h-5 w-5 text-amber-500" />}
              completed={progressDetails.details.assignments.submitted}
              total={progressDetails.details.assignments.total}
              color="amber"
            />
            
            <ProgressCard
              title="Blog PDFs"
              icon={<FileText className="h-5 w-5 text-purple-500" />}
              completed={progressDetails.details.blog_pdfs.viewed}
              total={progressDetails.details.blog_pdfs.total}
              color="purple"
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={handleContinueLearning}>
              <PlayCircle className="h-4 w-4 mr-2" />
              {progressDetails.progress_percentage === 0 ? "Start Learning" : "Continue Learning"}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function ProgressCard({ title, icon, completed, total, color }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "bg-blue-50 border-blue-100"
      case "green":
        return "bg-green-50 border-green-100"
      case "amber":
        return "bg-amber-50 border-amber-100"
      case "purple":
        return "bg-purple-50 border-purple-100"
      default:
        return "bg-gray-50 border-gray-100"
    }
  }

  return (
    <div className={`p-4 rounded-lg border ${getColorClasses()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon}
          <h4 className="font-medium text-sm ml-2">{title}</h4>
        </div>
        {completed === total && total > 0 && (
          <CheckCircle className="h-4 w-4 text-green-500" />
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold">{completed}/{total}</div>
        <div className="text-sm text-muted-foreground">{percentage}%</div>
      </div>
    </div>
  )
}

