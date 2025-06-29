"use client";

import { useQuery, useMutation } from "@apollo/client";
import { TRANSACTION_STATUS_COLORS, ESCROW_STATUS_COLORS } from "@/constants";
import { Transaction } from "@/types/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { GET_TRANSACTION, RELEASE_ESCROW } from "@/graphql/admin";

interface TransactionDetailsProps {
  id: string;
}

export default function TransactionDetails({ id }: TransactionDetailsProps) {
  const { data, loading, error } = useQuery<{ transaction: Transaction }>(
    GET_TRANSACTION,
    {
      variables: { id },
    }
  );

  const [releaseEscrow] = useMutation(RELEASE_ESCROW);

  const handleReleaseEscrow = async () => {
    try {
      await releaseEscrow({ variables: { input: { transactionId: id } } });
      toast.success("Escrow funds released successfully");
    } catch (err) {
      console.log("Failed to release escrow funds", err);

      toast.error("Failed to release escrow funds");
    }
  };

  if (loading)
    return (
      <div>
        <div className="h-screeen w-full justify-center items-center">
          Loading transaction...
        </div>
      </div>
    );
  if (error) return <div>Error loading transaction details</div>;
  if (!data?.transaction) return <div>Transaction not found</div>;

  const transaction = data.transaction;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transaction Details</h1>
        <Button
          onClick={handleReleaseEscrow}
          disabled={
            transaction.escrowStatus !== "FUNDED" ||
            transaction.status !== "COMPLETED"
          }
        >
          Release Escrow Funds
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Basic Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Transaction Code: {transaction.transactionCode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status:{" "}
                      <Badge
                        className={
                          TRANSACTION_STATUS_COLORS[transaction.status]
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Escrow Status:{" "}
                      <Badge
                        className={
                          ESCROW_STATUS_COLORS[transaction.escrowStatus]
                        }
                      >
                        {transaction.escrowStatus}
                      </Badge>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created:{" "}
                      {format(
                        new Date(transaction.createdAt),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Financial Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Amount: ₦{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Escrow Fee: ₦{transaction.escrowFee.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Amount: ₦{transaction.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Payment Status: {transaction.isPaid ? "Paid" : "Unpaid"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parties Involved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Seller</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Name: {transaction.seller.firstName}{" "}
                      {transaction.seller.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Email: {transaction.seller.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Buyer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Name: {transaction.buyer.firstName}{" "}
                      {transaction.buyer.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Email: {transaction.buyer.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transaction.logs.map((log) => (
              <div key={log.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(log.createdAt), "MMM dd, yyyy HH:mm")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {log.description}
                    </p>
                  </div>
                  <Badge className={TRANSACTION_STATUS_COLORS[log.status]}>
                    {log.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
