import { getBlogPosts } from "@/data/blog";
import { BlogPostsGrid } from "@/components/blog/BlogPostsGrid";
import { PageTransitionWrapper } from "@/components/ios/PageTransitionWrapper";

export const metadata = {
  title: "Blog",
  description: "My thoughts on software development, life, and more.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  // Sort posts by date, newest first
  const sortedPosts = posts.sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  return (
    <PageTransitionWrapper>
      <BlogPostsGrid posts={sortedPosts} />
    </PageTransitionWrapper>
  );
}
