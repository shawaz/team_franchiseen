import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, User, Tag, TrendingUp, Zap, Users, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog - Insights & Updates | Franchiseen',
  description: 'Stay updated with the latest insights, trends, and updates from Franchiseen. Learn about franchise management, technology, and industry best practices.',
};

const featuredPost = {
  id: 1,
  title: 'The Future of Franchise Management: AI and Automation Trends for 2024',
  excerpt: 'Discover how artificial intelligence and automation are transforming franchise operations, from predictive analytics to automated inventory management.',
  author: 'Sarah Chen',
  authorRole: 'CEO & Co-Founder',
  publishedAt: '2024-01-15',
  readTime: '8 min read',
  category: 'Technology',
  image: '/images/blog/ai-franchise-management.jpg',
  featured: true,
};

const blogPosts = [
  {
    id: 2,
    title: '10 Essential KPIs Every Franchise Owner Should Track',
    excerpt: 'Learn about the key performance indicators that can make or break your franchise success, and how to monitor them effectively.',
    author: 'Marcus Rodriguez',
    authorRole: 'CTO & Co-Founder',
    publishedAt: '2024-01-12',
    readTime: '6 min read',
    category: 'Business Strategy',
    image: '/images/blog/franchise-kpis.jpg',
  },
  {
    id: 3,
    title: 'How to Scale Your Franchise Operations Globally',
    excerpt: 'A comprehensive guide to expanding your franchise internationally, including legal considerations, cultural adaptations, and technology requirements.',
    author: 'Emily Watson',
    authorRole: 'Head of Product',
    publishedAt: '2024-01-10',
    readTime: '12 min read',
    category: 'Growth',
    image: '/images/blog/global-franchise-expansion.jpg',
  },
  {
    id: 4,
    title: 'The Rise of Cloud-Based POS Systems in Franchising',
    excerpt: 'Why modern franchises are moving away from traditional POS systems and embracing cloud-based solutions for better flexibility and insights.',
    author: 'David Kim',
    authorRole: 'Head of Engineering',
    publishedAt: '2024-01-08',
    readTime: '5 min read',
    category: 'Technology',
    image: '/images/blog/cloud-pos-systems.jpg',
  },
  {
    id: 5,
    title: 'Building a Strong Franchise Culture: Best Practices',
    excerpt: 'Learn how successful franchise brands maintain consistency while allowing for local adaptation and fostering a strong company culture.',
    author: 'Lisa Park',
    authorRole: 'VP of Customer Success',
    publishedAt: '2024-01-05',
    readTime: '7 min read',
    category: 'Culture',
    image: '/images/blog/franchise-culture.jpg',
  },
  {
    id: 6,
    title: 'Financial Management Tips for New Franchise Owners',
    excerpt: 'Essential financial management strategies to help new franchise owners maintain healthy cash flow and achieve profitability faster.',
    author: 'Michael Chen',
    authorRole: 'Head of Finance',
    publishedAt: '2024-01-03',
    readTime: '9 min read',
    category: 'Finance',
    image: '/images/blog/franchise-financial-management.jpg',
  },
  {
    id: 7,
    title: 'Customer Experience Trends Shaping the Franchise Industry',
    excerpt: 'Explore the latest customer experience trends and how franchise businesses can adapt to meet evolving consumer expectations.',
    author: 'Jennifer Liu',
    authorRole: 'Head of Marketing',
    publishedAt: '2024-01-01',
    readTime: '6 min read',
    category: 'Customer Experience',
    image: '/images/blog/customer-experience-trends.jpg',
  },
];

const categories = [
  { name: 'All', count: 7, active: true },
  { name: 'Technology', count: 2, active: false },
  { name: 'Business Strategy', count: 1, active: false },
  { name: 'Growth', count: 1, active: false },
  { name: 'Culture', count: 1, active: false },
  { name: 'Finance', count: 1, active: false },
  { name: 'Customer Experience', count: 1, active: false },
];

const stats = [
  { icon: TrendingUp, number: '50K+', label: 'Monthly Readers' },
  { icon: Users, number: '500+', label: 'Franchise Owners' },
  { icon: Globe, number: '25+', label: 'Countries Reached' },
  { icon: Zap, number: '100+', label: 'Articles Published' },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Insights for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}franchise success
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Stay ahead of the curve with expert insights, industry trends, and practical advice 
              to help your franchise thrive in today's competitive landscape.
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600 flex items-center justify-center gap-x-2">
                  <stat.icon className="h-5 w-5 text-blue-600" />
                  {stat.label}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  {stat.number}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Article</h2>
          </div>
          
          <article className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
              <div className="lg:pr-4">
                <div className="relative h-96 sm:h-80 lg:h-96">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="rounded-2xl object-cover"
                  />
                </div>
              </div>
              <div className="max-w-xl lg:max-w-lg">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={featuredPost.publishedAt} className="text-gray-500">
                    {formatDate(featuredPost.publishedAt)}
                  </time>
                  <span className="relative z-10 rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-600">
                    {featuredPost.category}
                  </span>
                </div>
                <div className="group relative max-w-xl">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link href={`/blog/${featuredPost.id}`}>
                      <span className="absolute inset-0" />
                      {featuredPost.title}
                    </Link>
                  </h3>
                  <p className="mt-5 text-sm leading-6 text-gray-600">{featuredPost.excerpt}</p>
                </div>
                <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                  <div className="relative flex items-center gap-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-gray-900">{featuredPost.author}</p>
                      <p className="text-gray-600">{featuredPost.authorRole}</p>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-x-2 text-xs text-gray-500">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`inline-flex items-center gap-x-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  category.active
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
                <span className={`text-xs ${category.active ? 'text-blue-200' : 'text-gray-500'}`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Latest Articles</h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Expert insights and practical advice for franchise success
            </p>
          </div>
          
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.id} className="flex flex-col items-start">
                <div className="relative w-full">
                  <div className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="rounded-2xl object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time dateTime={post.publishedAt} className="text-gray-500">
                      {formatDate(post.publishedAt)}
                    </time>
                    <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                      {post.category}
                    </span>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <Link href={`/blog/${post.id}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt}</p>
                  </div>
                  <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                    <div className="relative flex items-center gap-x-4">
                      <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-gray-900">{post.author}</p>
                        <p className="text-gray-600">{post.authorRole}</p>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-x-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-blue-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Stay in the loop
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Get the latest franchise insights, industry trends, and product updates delivered to your inbox.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <div className="flex gap-x-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white/75 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Subscribe
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm text-blue-200">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
