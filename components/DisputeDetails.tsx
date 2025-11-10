"use client";

import { useQuery, useMutation } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { DISPUTE_STATUS_COLORS, TRANSACTION_STATUS_COLORS } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DisputeStatus, TransactionStatus, Evidence } from "@/types/admin";
import { GET_DISPUTE, RESOLVE_DISPURE } from "@/graphql/admin";

interface Props {
  id: string;
}
const DisputeDetail: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const [resolution, setResolution] = useState("");
  const [status, setStatus] = useState<DisputeStatus>(
    DisputeStatus.RESOLVED_COMPROMISE
  );

  const { data, loading, error } = useQuery(GET_DISPUTE, {
    variables: { disputeId: id },
  });

  const [resolveDispute, { loading: resolving }] = useMutation(
    RESOLVE_DISPURE,
    {
      onCompleted: () => {
        toast.success("The dispute has been successfully resolved.");
        router.push("/disputes");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const dispute = data?.dispute;
  const transaction = dispute?.transaction;

  const handleResolveDispute = () => {
    resolveDispute({
      variables: {
        input: {
          disputeId: id,
          resolution,
          status,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">
              Error loading dispute: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p>Dispute not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dispute Details</h1>
        <Button onClick={() => router.back()}>Back</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dispute Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  className={
                    DISPUTE_STATUS_COLORS[dispute.status as DisputeStatus]
                  }
                >
                  {(dispute.status as DisputeStatus).replace(/_/g, " ")}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Reason
                </p>
                <p>{dispute.reason}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Description
                </p>
                <p>{dispute.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Initiator
                </p>
                <p>
                  {dispute.initiator.firstName} {dispute.initiator.lastName}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created At
                </p>
                <p>{format(new Date(dispute.createdAt), "PPP")}</p>
              </div>

              {dispute.resolvedAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Resolved At
                  </p>
                  <p>{format(new Date(dispute.resolvedAt), "PPP")}</p>
                </div>
              )}

              {dispute.resolution && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Resolution
                  </p>
                  <p>{dispute.resolution}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Transaction Code
                </p>
                <p>{transaction.transactionCode}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Title
                </p>
                <p>{transaction.title}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Amount
                </p>
                <p>₦{transaction.amount.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  className={
                    TRANSACTION_STATUS_COLORS[
                      transaction.status as TransactionStatus
                    ]
                  }
                >
                  {transaction.status.replace(/_/g, " ")}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Buyer
                </p>
                <p>
                  {transaction.buyer.firstName} {transaction.buyer.lastName}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Seller
                </p>
                <p>
                  {transaction.seller.firstName} {transaction.seller.lastName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {dispute.evidence && dispute.evidence.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dispute.evidence.map((evidence: Evidence) => (
                <Card key={evidence.id}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {evidence.evidenceType}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {evidence.description}
                      </p>
                      {evidence.evidenceUrl && (
                        <a
                          href={evidence.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          View Evidence
                        </a>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Submitted: {format(new Date(evidence.createdAt), "PPP")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {dispute.status !== DisputeStatus.CLOSED &&
        dispute.status !== DisputeStatus.RESOLVED_COMPROMISE &&
        dispute.status !== DisputeStatus.RESOLVED_FOR_BUYER &&
        dispute.status !== DisputeStatus.RESOLVED_FOR_SELLER && (
          <Card>
            <CardHeader>
              <CardTitle>Resolve Dispute</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Resolution Status
                  </label>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value as DisputeStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select resolution status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DisputeStatus.RESOLVED_FOR_BUYER}>
                        Resolve for Buyer
                      </SelectItem>
                      <SelectItem value={DisputeStatus.RESOLVED_FOR_SELLER}>
                        Resolve for Seller
                      </SelectItem>
                      <SelectItem value={DisputeStatus.RESOLVED_COMPROMISE}>
                        Compromise
                      </SelectItem>
                      <SelectItem value={DisputeStatus.CLOSED}>
                        Close Dispute
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Resolution Details
                  </label>
                  <Textarea
                    placeholder="Enter resolution details..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows={5}
                  />
                </div>

                <Button
                  onClick={handleResolveDispute}
                  disabled={resolving || !resolution}
                >
                  {resolving ? "Resolving..." : "Resolve Dispute"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default DisputeDetail;
