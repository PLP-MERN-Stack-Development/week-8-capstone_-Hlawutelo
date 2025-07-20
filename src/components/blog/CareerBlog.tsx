import React, { useState } from 'react';
import { Search, Clock, User, Tag, TrendingUp, BookOpen } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { BlogPost } from '../../types';

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Write a Compelling Cover Letter That Gets You Noticed',
    excerpt: 'Learn the essential elements of a cover letter that captures hiring managers\' attention and increases your chances of landing an interview.',
    content: 'A compelling cover letter is your opportunity to make a strong first impression...',
    author: 'Sarah Johnson',
    category: 'Job Applications',
    publishedAt: '2024-01-15',
    readTime: '5 min read',
    featured: true
  },
  {
    id: '2',
    title: 'The Ultimate Guide to Interview Preparation',
    excerpt: 'Master the art of interviewing with our comprehensive guide covering everything from research to follow-up strategies.',
    content: 'Interview preparation is crucial for career success...',
    author: 'Michael Chen',
    category: 'Interview Tips',
    publishedAt: '2024-01-12',
    readTime: '8 min read',
    featured: true
  },
  {
    id: '5',
    title: 'Remote Work Best Practices for 2025',
    excerpt: 'Discover the latest strategies for thriving in remote work environments and maintaining work-life balance.',
    content: 'Remote work has become the new normal...',
    author: 'Alex Rivera',
    category: 'Career Guides',
    publishedAt: '2024-01-20',
    readTime: '6 min read',
    featured: true
  },
  {
    id: '6',
    title: 'Salary Negotiation Tactics That Actually Work',
    excerpt: 'Learn proven strategies to negotiate better compensation packages and advance your career financially.',
    content: 'Salary negotiation is a critical skill...',
    author: 'Jennifer Park',
    category: 'Career Guides',
    publishedAt: '2024-01-18',
    readTime: '7 min read',
    featured: false
  },
  {
    id: '7',
    title: 'AI and the Future of Work: Preparing for Tomorrow',
    excerpt: 'Understand how artificial intelligence is reshaping the job market and how to future-proof your career.',
    content: 'Artificial intelligence is transforming industries...',
    author: 'Dr. Robert Kim',
    category: 'Career Guides',
    publishedAt: '2024-01-16',
    readTime: '9 min read',
    featured: false
  },
  {
    id: '8',
    title: 'Building a Portfolio That Stands Out',
    excerpt: 'Create a compelling portfolio that showcases your skills and attracts potential employers.',
    content: 'Your portfolio is your professional showcase...',
    author: 'Maria Gonzalez',
    category: 'Job Applications',
    publishedAt: '2024-01-14',
    readTime: '5 min read',
    featured: false
  },
  {
    id: '3',
    title: 'Building Your Personal Brand for Career Success',
    excerpt: 'Discover how to create and maintain a professional personal brand that opens doors to new opportunities.',
    content: 'Your personal brand is what sets you apart...',
    author: 'Emily Rodriguez',
    category: 'Career Guides',
    publishedAt: '2024-01-10',
    readTime: '6 min read',
    featured: false
  },
  {
    id: '4',
    title: 'Networking Strategies That Actually Work',
    excerpt: 'Learn effective networking techniques that help you build meaningful professional relationships.',
    content: 'Networking is about building genuine relationships...',
    author: 'David Kim',
    category: 'Career Guides',
    publishedAt: '2024-01-08',
    readTime: '7 min read',
    featured: false
  }
];

export const CareerBlog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Job Applications', 'Interview Tips', 'Career Guides'];

  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Career Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Expert advice, tips, and insights to accelerate your career growth
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="default" size="sm">
                        {post.category}
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        Featured
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" size="sm">
                      {post.category}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};