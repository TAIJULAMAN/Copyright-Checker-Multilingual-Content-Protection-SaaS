"use client"

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useGetAllBlogsQuery } from "@/redux/api/blogApi";
import { getImageUrl } from "@/redux/api/config";

export default function Blog() {
  const { data, isLoading, isError } = useGetAllBlogsQuery(undefined);
  const posts = data?.data || [];

  return (
    <main className=" bg-[#1b224a]">
      <section className="container mx-auto py-20 w-full ">
        <div className="w-full flex flex-col gap-2 justify-center items-center px-5 lg:px-0">
          <h2 className="text-4xl font-bold text-white">Blog</h2>
          <p className="text-gray-300 mt-2">
            Expert insights, tips, and updates to help you
          </p>
        </div>
        <div className="w-full px-5 lg:px-0 mt-5">
          <div className="flex justify-between items-center mb-10">
            <div className="flex  items-center gap-2">
              <div className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-semibold">
                Recent
              </div>
              <span className="text-white text-sm font-medium">Articles</span>
            </div>
            <Link
              href="/blog"
              className="text-white font-semibold flex items-center gap-2"
            >
              See all Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {/* Loading State */}
            {isLoading && (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800 font-semibold">Failed to load blogs</p>
                <p className="text-red-600 text-sm mt-2">Please try again later.</p>
              </div>
            )}

            {/* Blog Posts */}
            {!isLoading && !isError && posts?.map((post, index) => (
              <article key={post._id || index} className="overflow-hidden">
                <div className="bg-gradient-to-br from-purple-600 to-pink-500 h-48 rounded-lg flex items-center justify-center text-6xl mb-4 overflow-hidden">
                  {post.coverImage ? (
                    <Image
                      src={getImageUrl(post.coverImage)}
                      alt={post.title}
                      width={600}
                      height={500}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                      No Image
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-white text-sm mb-4">
                  {post.publishedDate
                    ? `Posted on ${new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : 'Recently posted'
                  }
                </p>
                <p className="text-white text-sm mb-4">{post.excerpt || 'Read more to discover...'}</p>
                <Link
                  href={`/blog/${post._id}`}
                  className="text-white text-sm font-semibold flex items-center gap-2"
                >
                  <Button className="bg-purple-600 text-white">
                    Read the article
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
