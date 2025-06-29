"use client";

import type React from "react";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_FILTERED_WITHDRAWALS, CONFIRM_WITHDRAWAL } from "@/graphql/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

enum WithdrawalStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

interface Withdrawal {
  id: string;
  amount: number;
  currency: string;
  type: string;
  reference: string;
  status: WithdrawalStatus;
  description: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
  updatedAt: string;
  wallet: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export default function WithdrawalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<string>("all"); // Updated default value
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: new Date(new Date().setDate(new Date().getDate() - 30)), to: new Date() });

  const { data, loading, error, refetch } = useQuery<{
    getFilteredWithdrawals: Withdrawal[];
  }>(GET_FILTERED_WITHDRAWALS, {
    variables: {
      filter: {
        page: currentPage,
        limit,
        status: status === "all" ? undefined : status, // Updated condition
        startDate: dateRange?.from,
        endDate: dateRange?.to,
      },
    },
  });

  const [confirmWithdrawal, { loading: confirming }] = useMutation(
    CONFIRM_WITHDRAWAL,
    {
      onCompleted: () => {
        toast.success("Withdrawal confirmed successfully")
        refetch();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const withdrawals = data?.getFilteredWithdrawals || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
  };

  const handleConfirmWithdrawal = (id: string) => {
    confirmWithdrawal({
      variables: {
        confirmWithdrawalId: id,
      },
    });
  };

  const getStatusColor = (status: WithdrawalStatus) => {
    switch (status) {
      case WithdrawalStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case WithdrawalStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case WithdrawalStatus.FAILED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Withdrawals</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-sm items-center space-x-2"
            >
              <Input
                type="search"
                placeholder="Search withdrawals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>{" "}
                  {/* Updated value */}
                  {Object.values(WithdrawalStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DateRangePicker date={dateRange}           onDateChange={(date) => setDateRange(date)}
 />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell className="font-medium">
                          {withdrawal.reference}
                        </TableCell>
                        <TableCell>
                          {withdrawal.wallet.user.firstName}{" "}
                          {withdrawal.wallet.user.lastName}
                        </TableCell>
                        <TableCell>
                          {withdrawal.currency}{" "}
                          {withdrawal.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(withdrawal.status)}>
                            {withdrawal.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(withdrawal.createdAt),
                            "MMM dd, yyyy"
                          )}
                        </TableCell>
                        <TableCell>
                          {withdrawal.status === WithdrawalStatus.PENDING && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleConfirmWithdrawal(withdrawal.id)
                              }
                              disabled={confirming}
                            >
                              Confirm
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
