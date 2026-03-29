import { getLandingPages } from "@/lib/db/landing-pages";
import { getSequences } from "@/lib/db/sequences";
import { SequenceList } from "@/components/admin/SequenceList";

export const metadata = { title: "系列郵件 | 悠藍電子報管理系統" };
export const dynamic = "force-dynamic";

export default async function SequencesPage() {
  const [sequences, pages] = await Promise.all([getSequences(), getLandingPages()]);
  const slugOptions = pages.map((p) => ({ value: p.slug, label: `${p.name} (${p.slug})` }));
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">系列郵件</h1>
        <p className="text-sm text-gray-500 mt-1">設定自動寄送的 Email 序列，訂閱者加入後按天數自動觸發</p>
      </div>
      <SequenceList sequences={sequences} slugOptions={slugOptions} />
    </div>
  );
}
