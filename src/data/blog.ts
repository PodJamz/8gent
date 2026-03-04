import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

type Author = {
  name: string;
  role: string;
  gradientClass: string;
};

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  gradient?: string;
  authors?: Author[];
  bookmarked?: boolean;
};

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      // https://rehype-pretty.pages.dev/#usage
      theme: {
        light: "min-light",
        dark: "min-dark",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return p.toString();
}

export async function getPost(slug: string) {
  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  let source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data: metadata } = matter(source);
  const content = await markdownToHTML(rawContent);
  
  return {
    source: content,
    metadata: metadata as Metadata,
    slug,
  };
}

async function getAllPosts(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      let slug = path.basename(file, path.extname(file));
      const post = await getPost(slug);
      if (!post) return null;
      return {
        metadata: post.metadata,
        slug: post.slug,
        source: post.source,
      };
    })
  );
  return posts.filter((post): post is NonNullable<typeof post> => post !== null);
}

export async function getBlogPosts() {
  return getAllPosts(path.join(process.cwd(), "content"));
}

export async function getAdjacentPosts(currentSlug: string) {
  const posts = await getBlogPosts();
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { previousPost: null, nextPost: null };
  }

  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return {
    previousPost: previousPost
      ? {
          slug: previousPost.slug,
          title: previousPost.metadata.title,
          gradient: previousPost.metadata.authors?.[0]?.gradientClass || "from-indigo-400 to-purple-600",
        }
      : null,
    nextPost: nextPost
      ? {
          slug: nextPost.slug,
          title: nextPost.metadata.title,
          gradient: nextPost.metadata.authors?.[0]?.gradientClass || "from-indigo-400 to-purple-600",
        }
      : null,
  };
}
