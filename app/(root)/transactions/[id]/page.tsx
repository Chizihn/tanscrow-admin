import TransactionDetails from "@/components/TransactionDetails";

interface TransactionDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TransactionDetailsPage({
  params,
}: TransactionDetailsProps) {
  return <TransactionDetails id={(await params).id} />;
}
