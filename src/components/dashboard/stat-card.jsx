import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

export default function StatCard({ title, value, description, trend, icon, color }) {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "bg-blue-50 text-blue-600"
      case "green":
        return "bg-green-50 text-green-600"
      case "purple":
        return "bg-purple-50 text-purple-600"
      case "amber":
        return "bg-amber-50 text-amber-600"
      case "red":
        return "bg-red-50 text-red-600"
      default:
        return "bg-gray-50 text-gray-600"
    }
  }

  const getTrendIcon = () => {
    if (trend > 0) {
      return <ArrowUpIcon className="h-4 w-4 text-green-600" />
    } else if (trend < 0) {
      return <ArrowDownIcon className="h-4 w-4 text-red-600" />
    }
    return null
  }

  const getTrendText = () => {
    const absValue = Math.abs(trend)
    if (trend > 0) {
      return <span className="text-green-600">+{absValue}%</span>
    } else if (trend < 0) {
      return <span className="text-red-600">{trend}%</span>
    }
    return <span>0%</span>
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`flex items-center justify-center h-10 w-10 rounded-full ${getColorClasses()}`}>{icon}</div>
        </div>
        <div className="flex items-center mt-2">
          <p className="text-sm text-muted-foreground">{description}</p>
          {trend !== 0 && (
            <div className="flex items-center ml-auto text-xs">
              {getTrendIcon()}
              <span className="ml-1">{getTrendText()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
