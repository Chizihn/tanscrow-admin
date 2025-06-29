"use client";

import type React from "react";

import { useState } from "react";
import { useQuery } from "@apollo/client";

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
import { format, subDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { DateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRANSACTION_STATUS_COLORS, ESCROW_STATUS_COLORS } from "@/constants";
import { EscrowStatus, Transaction, TransactionStatus } from "@/types/admin";
import { GET_FILTERED_TRANSACTIONS } from "@/graphql/admin";
import Link from "next/link";

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [transactionStatus, setTransactionStatus] = useState<
    TransactionStatus | "all"
  >("all");
  const [escrowStatus, setEscrowStatus] = useState<EscrowStatus | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data, loading, error } = useQuery<{
    getFilteredTransactions: Transaction[];
  }>(GET_FILTERED_TRANSACTIONS, {
    variables: {
      filter: {
        page: currentPage,
        limit,
        transactionStatus:
          transactionStatus === "all" ? undefined : transactionStatus,
        escrowStatus: escrowStatus === "all" ? undefined : escrowStatus,
        startDate: dateRange?.from || subDays(new Date(), 30),
        endDate: dateRange?.to || new Date(),
      },
    },
  });

  const transactions = data?.getFilteredTransactions || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
  };

  if (error) {
    console.error("Error fetching transactions:", error);
    return (
      <div className="text-red-600">
        An error occurred while fetching transactions.
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-sm items-center space-x-2"
            >
              <Input
                type="search"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <Select
                onValueChange={(value) =>
                  setTransactionStatus(value as TransactionStatus | "all")
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.values(TransactionStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) =>
                  setEscrowStatus(value as EscrowStatus | "all")
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Escrow Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Escrow Statuses</SelectItem>
                  {Object.values(EscrowStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DateRangePicker
                date={dateRange}
                onDateChange={(date) => setDateRange(date)}
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
                      <TableHead>Transaction Code</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Escrow Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.transactionCode}
                        </TableCell>
                        <TableCell>{transaction.title}</TableCell>

                        <TableCell>
                          ₦{transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              TRANSACTION_STATUS_COLORS[transaction.status]
                            }
                          >
                            {transaction.status.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              ESCROW_STATUS_COLORS[transaction.escrowStatus]
                            }
                          >
                            {transaction.escrowStatus.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(transaction.createdAt),
                            "MMM dd, yyyy"
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/transactions/${transaction.id}`}>
                              View
                            </Link>
                          </Button>
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
