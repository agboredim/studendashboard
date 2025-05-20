import {
  CalendarIcon,
  FileTextIcon,
  BookOpenIcon,
  ClockIcon,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function DeadlineCard({
  title,
  description,
  dueDate,
  type,
  courseId,
  courseName,
}) {
  const getIcon = () => {
    switch (type) {
      case "assignment":
        return (
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
            <FileTextIcon className="h-6 w-6" />
          </div>
        );
      case "exam":
        return (
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-100 text-red-600">
            <CalendarIcon className="h-6 w-6" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
            <BookOpenIcon className="h-6 w-6" />
          </div>
        );
    }
  };

  const formatDueDate = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getFullDate = (date) => {
    try {
      return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  const isUrgent = () => {
    const now = new Date();
    const deadline = new Date(dueDate);
    const diffInDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diffInDays <= 2;
  };

  return (
    <div className="flex items-start space-x-4">
      {getIcon()}
      <div className="space-y-1 flex-1">
        <h4 className="font-medium">{title}</h4>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {courseName && (
          <p className="text-xs text-muted-foreground">Course: {courseName}</p>
        )}
        <div className="flex items-center gap-2">
          <ClockIcon className="h-3 w-3 text-muted-foreground" />
          <p
            className={`text-xs font-medium ${
              isUrgent() ? "text-red-600" : "text-orange-600"
            }`}
            title={getFullDate(dueDate)}
          >
            Due {formatDueDate(dueDate)}
          </p>
        </div>
      </div>
    </div>
  );
}
