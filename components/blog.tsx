import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { getImageUrl, BASE_URL, REVALIDATE_TIME } from "@/redux/api/config";
import { getTranslations } from "next-intl/server";

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

export default async function Blog() {
  const t = await getTranslations('Blog');
  const response = await getBlogs();
  const posts = response?.data || [];
  const isError = !response;

  return (
    <main className=" bg-[#1b224a]">
      <section className="container mx-auto py-20 w-full ">
        <div className="w-full flex flex-col gap-2 justify-center items-center px-5 lg:px-0">
          <h2 className="text-4xl font-bold text-white">{t('title')}</h2>
          <p className="text-gray-300 mt-2">
            {t('subtitle')}
          </p>
        </div>
        <div className="w-full px-5 lg:px-0 mt-5">
          <div className="flex justify-between items-center mb-10">
            <div className="flex  items-center gap-2">
              <div className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-semibold">
                {t('recent')}
              </div>
              <span className="text-white text-sm font-medium">{t('articles')}</span>
            </div>
            <Link
              href="/blog"
              className="text-white font-semibold flex items-center gap-2"
            >
              {t('seeAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            
            {/* Error State */}
            {isError && (
              <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800 font-semibold">{t('errorTitle')}</p>
                <p className="text-red-600 text-sm mt-2">{t('errorDesc')}</p>
              </div>
            )}

            {/* Blog Posts */}
            {!isError && posts?.map((post: any, index: number) => (
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
                      {t('noImage')}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-white text-sm mb-4">
                  {post.publishedDate
                    ? `${t('postedOn')} ${new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : 'Recently posted'
                  }
                </p>
                <p className="text-white text-sm mb-4">{post.excerpt || t('readMore')}</p>
                <Link
                  href={`/blog/${post._id}`}
                  className="text-white text-sm font-semibold flex items-center gap-2"
                >
                  <Button className="bg-purple-600 text-white">
                    {t('readArticle')}
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
