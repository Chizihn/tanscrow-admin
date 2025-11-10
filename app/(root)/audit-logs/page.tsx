"use client";

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
import { Skeleton } from "@/components/ui/skeleton";
import { GET_AUDIT_LOGS } from "@/graphql/admin";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PAGE_SIZE = 20;

export default function AuditLogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState("");
  const [entityType, setEntityType] = useState("");
  const [action, setAction] = useState("");
  const [category, setCategory] = useState("");

  // Removed unused dateRange state completely
  // If you add a date picker later, re-introduce it then.

  const { data, loading, error, refetch } = useQuery(GET_AUDIT_LOGS, {
    variables: {
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
      filter: {
        userId: userId || undefined,
        entityType: entityType || undefined,
        action: action || undefined,
        category: category || undefined,
        // startDate & endDate removed since dateRange was removed
      },
    },
  });

  const logs = data?.getAuditLogs.items || [];
  const total = data?.getAuditLogs.total || 0;
  // Removed unused `hasMore`
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">
          View all system and user actions for compliance and security review.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log History</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSearch}
            className="flex flex-wrap gap-2 mb-4 items-end"
          >
            <Input
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-40"
            />
            <Input
              placeholder="Entity Type"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="w-40"
            />
            <Input
              placeholder="Action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-40"
            />
            <Input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-40"
            />
            <Button type="submit" className="h-10">
              Filter
            </Button>
          </form>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500">
              Error loading audit logs: {error.message}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No audit logs found.
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Entity Type</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map(
                      (log: {
                        id: string;
                        userId: string;
                        entityType: string;
                        action: string;
                        category: string;
                        details: Record<string, unknown>;
                        createdAt: string;
                      }) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.userId}</TableCell>
                          <TableCell>{log.entityType}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.category}</TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="truncate max-w-[120px] inline-block align-bottom cursor-pointer text-blue-600 underline">
                                    {JSON.stringify(log.details).slice(0, 20)}
                                    ...
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <pre className="whitespace-pre-wrap break-all text-xs max-w-xs">
                                    {JSON.stringify(log.details, null, 2)}
                                  </pre>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            {new Date(log.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )
                    )}
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

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
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
