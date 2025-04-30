import { format } from "date-fns";
import { CalendarIcon, BookIcon, FileTextIcon } from "lucide-react";

export default function DeadlineCard({ title, description, dueDate, type }) {
  const getIcon = () => {
    switch (type) {
      case "quiz":
        return <FileTextIcon className="h-5 w-5" />;
      case "assignment":
        return <BookIcon className="h-5 w-5" />;
      default:
        return <CalendarIcon className="h-5 w-5" />;
    }
  };

  const getMonthDay = (date) => {
    return {
      month: format(date, "MMM"),
      day: format(date, "d"),
    };
  };

  const { month, day } = getMonthDay(dueDate);

  return (
    <div className="flex items-start space-x-4">
      <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-100 rounded-md text-blue-800">
        <span className="text-xs font-semibold uppercase">{month}</span>
        <span className="text-xl font-bold">{day}</span>
      </div>

      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
