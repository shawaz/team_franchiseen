'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HelpCenter from '@/components/help/HelpCenter';
import SupportOptions from '@/components/help/SupportOptions';
import {
  Search,
  Book,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  ArrowRight,
  HelpCircle,
  FileText,
  Video,
  Clock,
  Star
} from 'lucide-react';



const categories = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'Learn the basics of using Franchiseen platform',
    articleCount: 12,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: CreditCard,
    title: 'Payments & Billing',
    description: 'Understand SOL payments, fees, and billing',
    articleCount: 8,
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Users,
    title: 'Team Management',
    description: 'Manage staff, roles, and permissions',
    articleCount: 15,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Track performance and generate reports',
    articleCount: 10,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Settings,
    title: 'Account Settings',
    description: 'Manage your account and preferences',
    articleCount: 6,
    color: 'bg-gray-50 text-gray-600',
  },
];

const popularArticles = [
  {
    title: 'How to invest in a franchise using SOL',
    category: 'Getting Started',
    readTime: '5 min read',
    views: '2.1k views',
    rating: 4.8,
  },
  {
    title: 'Understanding franchise tokenization',
    category: 'Payments & Billing',
    readTime: '7 min read',
    views: '1.8k views',
    rating: 4.9,
  },
  {
    title: 'Setting up your franchise team',
    category: 'Team Management',
    readTime: '4 min read',
    views: '1.5k views',
    rating: 4.7,
  },
  {
    title: 'Reading your franchise analytics dashboard',
    category: 'Analytics & Reports',
    readTime: '6 min read',
    views: '1.3k views',
    rating: 4.6,
  },
  {
    title: 'Managing multiple franchise locations',
    category: 'Getting Started',
    readTime: '8 min read',
    views: '1.1k views',
    rating: 4.8,
  },
];



export default function HelpCenterPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const handleChatClick = () => {
    setIsChatOpen(true);
    setIsVoiceOpen(false);
  };

  const handleVoiceClick = () => {
    setIsVoiceOpen(true);
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="h-4 w-4" />
              Support Center
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
              How can we help you today?
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Find answers to your questions, get support, and learn how to make the most of Franchiseen.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles, guides, or ask a question..."
                  className="w-full h-14 rounded-2xl border-0 bg-gray-50 pl-14 pr-6 text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <SupportOptions onChatClick={handleChatClick} onVoiceClick={handleVoiceClick} />

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse help topics
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find detailed guides and articles organized by category
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.title} href={`/help/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="group bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-200">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${category.color} transition-transform group-hover:scale-110 duration-200`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">{category.articleCount} articles</span>
                    <div className="flex items-center gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Explore</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular articles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Most helpful articles from our knowledge base
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {popularArticles.map((article, index) => (
              <Link key={index} href={`/help/article/${article.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="group bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="inline-flex items-center gap-2 text-gray-500">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {article.category}
                        </span>
                        <span className="inline-flex items-center gap-2 text-gray-500">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </span>
                        <span className="text-gray-500">{article.views}</span>
                        <span className="inline-flex items-center gap-1 text-yellow-600">
                          <Star className="h-4 w-4 fill-current" />
                          {article.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Read article</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick access
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jump to the most commonly used resources
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link href="/help/getting-started" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Book className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Getting Started
                    </h3>
                    <p className="text-sm text-gray-600">Complete setup guide</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>

            <Link href="/help/video-tutorials" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-purple-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      Video Tutorials
                    </h3>
                    <p className="text-sm text-gray-600">Step-by-step videos</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>

            <Link href="/help/api-documentation" className="group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-green-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      API Docs
                    </h3>
                    <p className="text-sm text-gray-600">Developer resources</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Still need help?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Our support team is here to help you succeed with your franchise operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-200 hover:scale-105 active:scale-95">
                Contact Support Team
              </button>
              <Link
                href="/help/contact"
                className="w-full sm:w-auto text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                View all options
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Help Center Components */}
      <HelpCenter
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        isVoiceOpen={isVoiceOpen}
        setIsVoiceOpen={setIsVoiceOpen}
      />
    </div>
  );
}