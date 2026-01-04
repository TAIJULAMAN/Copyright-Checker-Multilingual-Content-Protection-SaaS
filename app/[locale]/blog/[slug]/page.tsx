import { Calendar, User, Clock } from "lucide-react"
import PageHeader from "@/components/page-header"
import Image from "next/image"
import { getImageUrl, BASE_URL, REVALIDATE_TIME } from "@/redux/api/config"

async function getBlog(slug: string) {
  try {
    const res = await fetch(`${BASE_URL}/blogs/${slug}`, {
      next: { revalidate: REVALIDATE_TIME },
    });
    
    if (!res.ok) return null;
    
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log('BlogDetail slug:', slug);
  const response = await getBlog(slug);
  console.log('BlogDetail response:', response);
  const post = response?.data;
  const isError = !response;

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        backLink={{ href: "/blog", text: "Back to Blog" }}
        maxWidth="4xl"
        className="pb-8"
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold">Failed to load blog post</p>
            <p className="text-red-600 text-sm mt-2">Please try again later.</p>
          </div>
        )}

        {/* Blog Post Content */}
        {!isError && post && (
          <>
            {/* Featured Image */}
            <div className="mb-8 rounded-lg overflow-hidden h-96 bg-gradient-to-br from-purple-600 to-pink-500">
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
                  No Image Available
                </div>
              )}
            </div>

            {/* Article Header */}
            <article className="prose prose-lg max-w-none">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post?.title}</h1>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-200">
                {post.author && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{post?.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {post?.publishedDate
                      ? new Date(post?.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : 'Recently published'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">5 min read</span>
                </div>
              </div>

              {/* Article Content */}
              {post?.body && (
                <div
                  className="space-y-6 text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: post?.body
                      .replace(/<h2>/g, '<h2 class="text-3xl font-bold text-gray-900 mt-8 mb-4">')
                      .replace(/<h3>/g, '<h3 class="text-2xl font-bold text-gray-800 mt-6 mb-3">')
                      .replace(/<p>/g, '<p class="text-gray-700 mb-4">')
                      .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-2">')
                      .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 space-y-2">')
                      .replace(/<li>/g, '<li class="text-gray-700">'),
                  }}
                />
              )}
            </article>
          </>
        )}
      </main>
    </div>
  )
}
