import DisputeDetail from "@/components/DisputeDetails";

export default async function DisputeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DisputeDetail id={id} />;
}
