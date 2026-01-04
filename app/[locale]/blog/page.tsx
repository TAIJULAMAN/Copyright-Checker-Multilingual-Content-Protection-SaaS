import Link from "next/link"
import { ArrowRight } from "lucide-react"
import PageHeader from "@/components/page-header"
import Image from "next/image"
import { getImageUrl, BASE_URL, REVALIDATE_TIME } from "@/redux/api/config"

async function getBlogs() {
  try {
    const res = await fetch(`${BASE_URL}/blogs`, {
      next: { revalidate: REVALIDATE_TIME },
    });
    
    if (!res.ok) return null;
    
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function BlogPage() {
  const response = await getBlogs();
  const posts = response?.data || [];
  const isError = !response;

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Blog"
        description="Expert insights, tips, and updates to help you protect your content"
        backLink={{ href: "/", text: "Back to Home" }}
      />

      {/* Blog Grid */}
      <main className="container mx-auto px-5 md:px-0 py-16">
        
        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold">Failed to load blog posts</p>
            <p className="text-red-600 text-sm mt-2">Please try again later.</p>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <article
                key={post._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-600 to-pink-500">
                  {post?.coverImage ? (
                    <Image
                      src={getImageUrl(post?.coverImage)}
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
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    {post.category && (
                      <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded">
                        {post.category}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">5 min read</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt || 'Read more to discover...'}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-500">
                        {post.publishedDate
                          ? `Posted on ${new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                          : 'Recently posted'
                        }
                      </p>
                      {post.author && (
                        <p className="text-xs text-gray-500">By {post.author}</p>
                      )}
                    </div>
                    <Link
                      href={`/blog/${post._id}`}
                      className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
