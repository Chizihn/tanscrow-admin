"use client";

import type React from "react";

import { useQuery } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  CreditCard,
  AlertTriangle,
  DollarSign,
  CalendarIcon,
} from "lucide-react";
import { useState } from "react";
import { DateRangePicker } from "@/components/date-range-picker";
import { BarChart } from "@/components/ui/bar-chart";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { GET_ADMIN_DASHBOARD_STATS, TRANSACTION_REPORT } from "@/graphql/admin";
import { AdminDashboardStats, TransactionReport } from "@/types/admin";
import { format } from "date-fns";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data: statsData, loading: statsLoading } = useQuery<{
    getAdminDashboardStats: AdminDashboardStats;
  }>(GET_ADMIN_DASHBOARD_STATS);

  const { data: reportData, loading: reportLoading } = useQuery<{
    transactionReport: TransactionReport;
  }>(TRANSACTION_REPORT, {
    variables: {
      dateRange: dateRange
        ? {
            startDate: dateRange.from,
            endDate: dateRange.to,
          }
        : undefined,
    },
  });

  const stats = statsData?.getAdminDashboardStats;
  const report = reportData?.transactionReport;

  const statusData = reportData?.transactionReport?.statusBreakdown
    ? [
        {
          name: reportData.transactionReport.statusBreakdown.status,
          value: reportData.transactionReport.statusBreakdown.count,
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center gap-4 pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <DateRangePicker
          date={dateRange}
          onDateChange={(date: DateRange | undefined) => setDateRange(date)}
          className="shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers}
          loading={statsLoading}
          icon={<Users className="h-6 w-6 text-primary" />}
          dateRange={dateRange}
        />
        <StatsCard
          title="Total Transactions"
          value={stats?.totalTransactions}
          loading={statsLoading}
          icon={<CreditCard className="h-6 w-6 text-primary" />}
          dateRange={dateRange}
        />
        <StatsCard
          title="Active Disputes"
          value={stats?.activeDisputes}
          loading={statsLoading}
          icon={<AlertTriangle className="h-6 w-6 text-primary" />}
          dateRange={dateRange}
        />
        <StatsCard
          title="Transaction Volume"
          value={stats?.totalTransactionVolume}
          loading={statsLoading}
          prefix="₦"
          icon={<DollarSign className="h-6 w-6 text-primary" />}
          dateRange={dateRange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {reportLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <BarChart
                data={statusData}
                index="name"
                categories={["value"]}
                colors={["primary"]}
                valueFormatter={(value: number) => `${value} transactions`}
                className="h-full"
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transaction Metrics</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {reportLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    title="Total Transactions"
                    value={report?.totalTransactions || 0}
                  />
                  <MetricCard
                    title="Completed Transactions"
                    value={report?.completedTransactions || 0}
                  />
                  <MetricCard
                    title="Canceled Transactions"
                    value={report?.canceledTransactions || 0}
                  />
                  <MetricCard
                    title="Disputed Transactions"
                    value={report?.disputedTransactions || 0}
                  />
                  <MetricCard
                    title="Total Amount"
                    value={`₦${report?.totalAmount?.toLocaleString() || 0}`}
                  />
                  <MetricCard
                    title="Total Escrow Fees"
                    value={`₦${report?.totalEscrowFees?.toLocaleString() || 0}`}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  loading,
  icon,
  prefix = "",
  dateRange,
}: {
  title: string;
  value?: number;
  loading: boolean;
  icon: React.ReactNode;
  prefix?: string;
  dateRange?: DateRange;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <h3 className="text-2xl font-bold mt-1">
                {prefix}
                {value?.toLocaleString()}
              </h3>
            )}
            {dateRange && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  {dateRange?.from &&
                    dateRange?.to &&
                    `${format(dateRange.from, "MMM dd, yyyy")} - ${format(
                      dateRange.to,
                      "MMM dd, yyyy"
                    )}`}
                </span>
              </div>
            )}
          </div>
          <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="bg-card/50 p-4 rounded-lg">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
