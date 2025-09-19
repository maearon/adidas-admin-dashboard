"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, Eye } from "lucide-react"

const stats = [
  {
    title: "Total Products",
    value: "1,234",
    description: "+20.1% from last month",
    icon: Package,
  },
  {
    title: "Total Orders",
    value: "5,678",
    description: "+15.3% from last month",
    icon: ShoppingCart,
  },
  {
    title: "Total Customers",
    value: "9,012",
    description: "+8.7% from last month",
    icon: Users,
  },
  {
    title: "Revenue",
    value: "$45,231.89",
    description: "+25.2% from last month",
    icon: DollarSign,
  },
  {
    title: "Page Views",
    value: "123,456",
    description: "+12.5% from last month",
    icon: Eye,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    description: "+0.5% from last month",
    icon: TrendingUp,
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-wide">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-2 border-black">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wide">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
