import { LandingPageForm } from "@/components/admin/LandingPageForm";

export const metadata = { title: "新增頁面 | 悠藍電子報管理系統" };

export default function NewLandingPagePage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">新增 Landing Page</h1>
      <LandingPageForm />
    </div>
  );
}
