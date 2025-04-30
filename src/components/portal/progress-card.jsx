import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProgressCard({ title, progress, onResume }) {
  return (
    <Card className="bg-blue-50 border-none">
      <CardContent className="p-4 space-y-3">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">Resume course</p>

        <div className="relative h-2 bg-blue-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-600"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-end">
          <span className="text-xs text-blue-700 font-medium">{progress}%</span>
        </div>

        <Button className="w-full bg-blue-900" onClick={onResume}>
          Resume Course
        </Button>
      </CardContent>
    </Card>
  );
}
