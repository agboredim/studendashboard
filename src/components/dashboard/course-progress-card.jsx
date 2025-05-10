import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayIcon, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { baseUrl } from "@/services/api";

export default function CourseProgressCard({
  id,
  title,
  instructor,
  progress,
  lastActivity,
  thumbnail,
  nextLesson,
}) {
  const navigate = useNavigate();

  const formattedLastActivity = lastActivity
    ? formatDistanceToNow(new Date(lastActivity), { addSuffix: true })
    : null;

  return (
    <Card className="overflow-hidden">
      <div className="relative h-32 w-full">
        <img
          src={`${baseUrl}${thumbnail}`}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-3">
          <h3 className="font-semibold text-white">{title}</h3>
          {instructor && <p className="text-xs text-white/80">{instructor}</p>}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{progress}% Complete</span>
            {formattedLastActivity && (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formattedLastActivity}
              </span>
            )}
          </div>
          <Progress value={progress} className="h-2" />
          {nextLesson && (
            <p className="text-xs text-muted-foreground">Next: {nextLesson}</p>
          )}
          <Button
            className="w-full"
            size="sm"
            onClick={() => navigate(`/portal/learn/${id}`)}
          >
            <PlayIcon className="h-4 w-4 mr-2" /> Continue Learning
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
