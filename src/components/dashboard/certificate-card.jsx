import { Award, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

export default function CertificateCard({ id, title, issueDate, courseId, courseName }) {
  const formattedDate = format(new Date(issueDate), "MMM d, yyyy")

  return (
    <div className="flex items-start space-x-3">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-amber-100 text-amber-600">
        <Award className="h-6 w-6" />
      </div>
      <div className="space-y-1 flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{title}</h4>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        {courseName && <p className="text-xs text-muted-foreground">Course: {courseName}</p>}
        <p className="text-xs text-muted-foreground">Issued on {formattedDate}</p>
      </div>
    </div>
  )
}
