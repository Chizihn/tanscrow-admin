"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

import { ChartContainer } from "./chart"

interface BarChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export function BarChart({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  className,
}: BarChartProps) {
  return (
    <ChartContainer id="bar-chart" config={{}}>
      <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
        <RechartsPrimitive.BarChart data={data}>
          <RechartsPrimitive.XAxis dataKey={index} />
          {categories.map((category, i) => (
            <RechartsPrimitive.Bar
              key={category}
              dataKey={category}
              fill={colors[i]}
              stackId="a"
            />
          ))}
          <RechartsPrimitive.YAxis />
          <RechartsPrimitive.Tooltip
            formatter={valueFormatter}
            labelFormatter={(label) => label.toString()}
          />
        </RechartsPrimitive.BarChart>
      </RechartsPrimitive.ResponsiveContainer>
    </ChartContainer>
  )
}

export default BarChart
