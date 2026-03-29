import { notFound } from "next/navigation";
import { getSequenceById, getSequenceEmails } from "@/lib/db/sequences";
import { SequenceDetail } from "@/components/admin/SequenceDetail";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function SequenceDetailPage({ params }: Props) {
  const { id } = await params;
  const [sequence, emails] = await Promise.all([getSequenceById(id), getSequenceEmails(id)]);
  if (!sequence) notFound();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{sequence.name}</h1>
        <p className="text-sm text-gray-500 mt-1">管理此序列的所有信件與發送時機</p>
      </div>
      <SequenceDetail sequence={sequence} initialEmails={emails} />
    </div>
  );
}
