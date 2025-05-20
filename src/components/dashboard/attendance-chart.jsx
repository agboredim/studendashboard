
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function AttendanceChart({ data }) {
  const totalAttendance = data.reduce((sum, item) => sum + item.attendanceRate, 0)
  const averageAttendance = Math.round(totalAttendance / data.length)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-sm p-2 text-xs">
          <p className="font-medium">{label}</p>
          <p className="text-primary">{`Attendance: ${payload[0].value}%`}</p>
          <p className="text-muted-foreground">{`${payload[0].payload.attended} of ${payload[0].payload.total} classes`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">{averageAttendance}%</p>
          <p className="text-sm text-muted-foreground">Average attendance rate</p>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickCount={5}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="attendanceRate" radius={[4, 4, 0, 0]} className="fill-primary" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
