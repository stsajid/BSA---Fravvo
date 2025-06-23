"use client"

import { useTheme } from "next-themes"
import {
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
} from "recharts"

interface ChartProps {
  className?: string
}

// Sample data for charts
const lineChartData = [
  { name: "Jan", tasks: 12, activity: 24, projects: 5 },
  { name: "Feb", tasks: 19, activity: 37, projects: 6 },
  { name: "Mar", tasks: 15, activity: 29, projects: 7 },
  { name: "Apr", tasks: 27, activity: 53, projects: 8 },
  { name: "May", tasks: 24, activity: 48, projects: 9 },
  { name: "Jun", tasks: 32, activity: 64, projects: 10 },
]

const pieChartData = [
  { name: "To Do", value: 12, color: "#6366f1" },
  { name: "In Progress", value: 8, color: "#f59e0b" },
  { name: "Review", value: 5, color: "#8b5cf6" },
  { name: "Done", value: 20, color: "#10b981" },
]

const barChartData = [
  { name: "Low", value: 10, color: "#10b981" },
  { name: "Medium", value: 15, color: "#f59e0b" },
  { name: "High", value: 8, color: "#ef4444" },
]

export function LineChart({ className }: ChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="name"
            stroke={isDark ? "#6b7280" : "#9ca3af"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke={isDark ? "#6b7280" : "#9ca3af"} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              borderColor: isDark ? "#374151" : "#e5e7eb",
              borderRadius: "0.375rem",
              color: isDark ? "#f9fafb" : "#111827",
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="tasks" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line
            type="monotone"
            dataKey="activity"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="projects"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PieChart({ className }: ChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function BarChart({ className }: ChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="name"
            stroke={isDark ? "#6b7280" : "#9ca3af"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke={isDark ? "#6b7280" : "#9ca3af"} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              borderColor: isDark ? "#374151" : "#e5e7eb",
              borderRadius: "0.375rem",
              color: isDark ? "#f9fafb" : "#111827",
            }}
          />
          <Bar dataKey="value">
            {barChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
