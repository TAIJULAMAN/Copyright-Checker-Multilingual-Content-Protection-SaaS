"use client";

import { Loader2 } from "lucide-react";
import { useGetAboutQuery } from "@/redux/api/aboutApi";

export default function AboutPage() {
  const { data: response, isLoading, isError } = useGetAboutQuery({});
  const content = response?.data?.content;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

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
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </div>
    </div>
  );
}
