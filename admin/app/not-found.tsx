import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <p className="text-gray-600 mb-6">找不到這個頁面</p>
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          回首頁
        </Link>
      </div>
    </div>
  );
}
