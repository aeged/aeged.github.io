import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'Alex Gednov',
    description: 'Blog RSS',
    site: context.site,
    items: posts.map((post) => ({
      link: `/blog/${post.slug}/`,
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
    })),
  });
}
