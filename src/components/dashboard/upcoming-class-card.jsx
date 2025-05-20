import { Video, Clock, Calendar } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

export default function UpcomingClassCard({ id, title, instructor, startTime, duration, courseId, courseName }) {
  const formattedDate = format(new Date(startTime), "MMM d, yyyy")
  const formattedTime = format(new Date(startTime), "h:mm a")
  const timeUntil = formatDistanceToNow(new Date(startTime), { addSuffix: true })

  const isStartingSoon = () => {
    const now = new Date()
    const classTime = new Date(startTime)
    const diffInHours = (classTime - now) / (1000 * 60 * 60)
    return diffInHours <= 1
  }

  return (
    <div className="flex items-start space-x-3">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
        <Video className="h-6 w-6" />
      </div>
      <div className="space-y-1 flex-1">
        <h4 className="font-medium">{title}</h4>
        {instructor && <p className="text-xs text-muted-foreground">Instructor: {instructor}</p>}
        {courseName && <p className="text-xs text-muted-foreground">Course: {courseName}</p>}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formattedDate}, {formattedTime}
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {duration} min
          </div>
        </div>
        <p className={`text-xs font-medium ${isStartingSoon() ? "text-red-600" : "text-blue-600"}`}>
          Starts {timeUntil}
        </p>
      </div>
    </div>
  )
}
