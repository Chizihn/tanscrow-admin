"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { TRANSACTION_REPORT, GET_DISPUTE_REPORT } from "@/graphql/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRangePicker } from "@/components/date-range-picker";
import { DisputeReport, TransactionReport } from "@/types/admin";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { PieChart as RechartsPieChart, Pie as RechartsPie, Cell as RechartsCell } from "recharts";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data: transactionData, loading: transactionLoading } = useQuery<{
    transactionReport: TransactionReport;
  }>(TRANSACTION_REPORT, {
    variables: {
      dateRange: {
        startDate: dateRange?.from || subDays(new Date(), 30),
        endDate: dateRange?.to || new Date(),
      },
    },
  });

  const { data: disputeData, loading: disputeLoading } = useQuery<{
    disputeReport: DisputeReport;
  }>(GET_DISPUTE_REPORT, {
    variables: {
      dateRange: {
        startDate: dateRange?.from || subDays(new Date(), 30),
        endDate: dateRange?.to || new Date(),
      },
    },
  });

  const transactionReport = transactionData?.transactionReport;
  const disputeReport = disputeData?.disputeReport;

  const transactionStatusData = transactionReport?.statusBreakdown
    ? Object.entries(transactionReport.statusBreakdown).map(([key, value]) => ({
        name: value.status,
        value: value.count,
      }))
    : [];

  const disputeData1 = [
    { name: "Resolved", value: disputeReport?.resolvedDisputes || 0 },
    { name: "Pending", value: disputeReport?.pendingDisputes || 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <DateRangePicker
          date={dateRange}
          onDateChange={(date) => setDateRange(date)}
        />
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {transactionLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard
                      title="Total Transactions"
                      value={transactionReport?.totalTransactions || 0}
                    />
                    <MetricCard
                      title="Total Amount"
                      value={`₦${
                        transactionReport?.totalAmount?.toLocaleString() || 0
                      }`}
                    />
                    <MetricCard
                      title="Completed Transactions"
                      value={transactionReport?.completedTransactions || 0}
                    />
                    <MetricCard
                      title="Canceled Transactions"
                      value={transactionReport?.canceledTransactions || 0}
                    />
                    <MetricCard
                      title="Disputed Transactions"
                      value={transactionReport?.disputedTransactions || 0}
                    />
                    <MetricCard
                      title="Average Amount"
                      value={`₦${
                        transactionReport?.averageTransactionAmount?.toLocaleString() ||
                        0
                      }`}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {transactionLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <RechartsPieChart width={400} height={300}>
                    <RechartsPie
                      data={transactionStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {transactionStatusData.map((entry, index) => (
                        <RechartsCell
                          key={`cell-${index}`}
                          fill={`hsl(${(index * 360) / transactionStatusData.length}, 70%, 50%)`}
                        />
                      ))}
                    </RechartsPie>
                  </RechartsPieChart>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="disputes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dispute Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {disputeLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard
                      title="Total Disputes"
                      value={disputeReport?.totalDisputes || 0}
                    />
                    <MetricCard
                      title="Resolved Disputes"
                      value={disputeReport?.resolvedDisputes || 0}
                    />
                    <MetricCard
                      title="Pending Disputes"
                      value={disputeReport?.pendingDisputes || 0}
                    />
                    <MetricCard
                      title="Dispute Rate"
                      value={`${disputeReport?.disputeRate?.toFixed(2) || 0}%`}
                    />
                    <MetricCard
                      title="Avg. Resolution Time"
                      value={`${
                        disputeReport?.averageResolutionTime || 0
                      } days`}
                      colSpan={2}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dispute Status</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {disputeLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <RechartsPieChart width={400} height={300}>
                    <RechartsPie
                      data={disputeData1}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {disputeData1.map((entry, index) => (
                        <RechartsCell
                          key={`cell-${index}`}
                          fill={`hsl(${(index * 360) / disputeData1.length}, 70%, 50%)`}
                        />
                      ))}
                    </RechartsPie>
                  </RechartsPieChart>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({
  title,
  value,
  colSpan = 1,
}: {
  title: string;
  value: number | string;
  colSpan?: number;
}) {
  return (
    <div
      className={`bg-card/50 p-4 rounded-lg ${
        colSpan === 2 ? "col-span-2" : ""
      }`}
    >
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
