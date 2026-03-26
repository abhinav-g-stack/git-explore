"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getSalesPerformanceData, getCategorySalesData } from "@/lib/actions/order-actions";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type PerformanceData = { month: string; sales: number; units: number; }[]
type CategoryData = { name: string; value: number; fill: string; }[]

export function DashboardCharts() {
  const [performanceData, setPerformanceData] = useState<PerformanceData>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryData>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [perfData, catData] = await Promise.all([
        getSalesPerformanceData(),
        getCategorySalesData(),
      ]);
      setPerformanceData(perfData);
      setCategoryPerformance(catData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <>
        <Card><CardContent className="flex justify-center items-center h-[300px]"><Loader2 className="h-8 w-8 animate-spin"/></CardContent></Card>
        <Card><CardContent className="flex justify-center items-center h-[300px]"><Loader2 className="h-8 w-8 animate-spin"/></CardContent></Card>
      </>
    )
  }

  return (
    <>
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Monthly sales and units sold.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                <Legend />
                <Bar yAxisId="left" dataKey="sales" fill="hsl(var(--primary))" name="Sales ($)" />
                <Bar yAxisId="right" dataKey="units" fill="hsl(var(--accent))" name="Units Sold"/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Breakdown of sales across product categories.</CardDescription>
          </CardHeader>
          <CardContent>
             {categoryPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={categoryPerformance}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {categoryPerformance.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No sales data available.
                </div>
             )}
          </CardContent>
        </Card>
      </>
  );
}
