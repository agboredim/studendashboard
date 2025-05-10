import { formatDistanceToNow } from "date-fns"
import { BookOpen, CheckCircle, Clock, FileText, PlayCircle, Video } from 'lucide-react'

export default function ActivityTimeline({ activities }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case "course_progress":
        return <BookOpen className="h-4 w-4 text-blue-500" />
      case "assignment_submission":
        return <FileText className="h-4 w-4 text-orange-500" />
      case "quiz_completion":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "video_watched":
        return <Video className="h-4 w-4 text-purple-500" />
      case "live_class_attended":
        return <PlayCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No recent activity</p>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
            <div className="space-y-1">
              <p className="text-sm">{activity.description}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(activity.timestamp)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
