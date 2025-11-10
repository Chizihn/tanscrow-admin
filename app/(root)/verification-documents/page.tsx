/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery, useMutation } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  PENDING_VERIFICATION_DOCUMENTS,
  REVIEW_VERIFICATION_DOCUMENT,
} from "@/graphql/admin";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function VerificationDocumentsPage() {
  const { data, loading, error, refetch } = useQuery(
    PENDING_VERIFICATION_DOCUMENTS
  );
  const [reviewVerificationDocument, { loading: reviewing }] = useMutation(
    REVIEW_VERIFICATION_DOCUMENT,
    {
      onCompleted: () => {
        toast.success("Document reviewed successfully");
        refetch();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleReview = (
    documentId: string,
    status: string,
    rejectionReason?: string
  ) => {
    reviewVerificationDocument({
      variables: {
        input: {
          documentId,
          status,
          rejectionReason,
        },
      },
    });
  };

  const documents = data?.pendingVerificationDocuments || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-bold">Verification Documents</h1>
        <p className="text-muted-foreground">
          Review and approve or reject user KYC/identity documents.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending Verification Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500">
              Error loading documents: {error.message}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No pending verification documents found.
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc: any) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.userId}</TableCell>
                      <TableCell>{doc.documentType}</TableCell>
                      <TableCell>{doc.documentNumber}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={doc.documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                View
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>Open document in new tab</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>{doc.verificationStatus}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-600"
                          disabled={reviewing}
                          onClick={() => handleReview(doc.id, "APPROVED")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={reviewing}
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to reject this document?"
                              )
                            ) {
                              handleReview(
                                doc.id,
                                "REJECTED",
                                "Invalid document"
                              );
                            }
                          }}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
