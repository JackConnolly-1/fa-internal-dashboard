'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react'

interface CompanyInvestment {
  name: string
  value: number
  color: string
}

interface IndustryInvestment {
  name: string
  amount: number
  color: string
}

interface DashboardChartsProps {
  companyInvestments: CompanyInvestment[]
  industryInvestments: IndustryInvestment[]
}

const CHART_COLORS = [
  '#1a3a6b', // navy
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#6366f1', // indigo
  '#84cc16', // lime
]

interface ChartTooltipPayload {
  value: number
  payload: {
    name: string
  }
}

interface ChartTooltipProps {
  active?: boolean
  payload?: ChartTooltipPayload[]
}

export default function DashboardCharts({ companyInvestments, industryInvestments }: DashboardChartsProps) {
  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
    return `$${value.toFixed(0)}`
  }

  const CustomTooltip = ({ active, payload }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-md shadow-sm">
          <p className="font-medium text-slate-800">{payload[0].payload.name}</p>
          <p className="text-sm text-slate-600">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Company Investments */}
      <Card bordered>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center">
              <PieChartIcon className="w-4 h-4 text-navy-700" />
            </div>
            <CardTitle className="text-lg font-serif">Your Top Company Investments</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {companyInvestments.length === 0 ? (
            <div className="h-48 md:h-64 flex items-center justify-center text-slate-400">
              <p>No investment data available</p>
            </div>
          ) : (
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={companyInvestments}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                    labelLine={false}
                  >
                    {companyInvestments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => (
                      <span className="text-xs text-slate-600">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dollars Deployed by Industry */}
      <Card bordered>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-700" />
            </div>
            <CardTitle className="text-lg font-serif">Dollars Deployed by Industry</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {industryInvestments.length === 0 ? (
            <div className="h-48 md:h-64 flex items-center justify-center text-slate-400">
              <p>No industry data available</p>
            </div>
          ) : (
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={industryInvestments}
                  margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                    labelFormatter={(label) => `Industry: ${label}`}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <Bar 
                    dataKey="amount" 
                    name="Investment"
                    radius={[4, 4, 0, 0]}
                  >
                    {industryInvestments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
