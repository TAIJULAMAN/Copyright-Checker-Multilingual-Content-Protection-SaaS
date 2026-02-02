import { Loader2 } from "lucide-react";
import { BASE_URL, REVALIDATE_TIME } from "@/redux/api/config";

async function getAbout() {
  try {
    const res = await fetch(`${BASE_URL}/legal-docs/about-us`, {
      // next: { revalidate: REVALIDATE_TIME },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function AboutPage() {
  const response = await getAbout();
  const data = response?.data;
  const isError = !response;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load content.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">About Us</h1>
        <div
          className="prose prose-purple max-w-none"
          dangerouslySetInnerHTML={{ __html: data?.content || '' }}
        />
      </div>
    </div>
  );
}
