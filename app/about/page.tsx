"use client";

import { useGetAboutQuery } from "@/redux/api/aboutApi";
import { Loader2 } from "lucide-react";

export default function AboutPage() {
  const { data, isLoading, error } = useGetAboutQuery(undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !data?.success) {
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
          dangerouslySetInnerHTML={{ __html: data.data.content }}
        />
      </div>
    </div>
  );
}
