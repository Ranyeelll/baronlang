import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Brain, Sparkles, ArrowRight } from 'lucide-react';

export const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-red-50">
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[#800020]" />
            <span className="text-xl font-semibold text-gray-900">
              StudyBuddy
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-700 hover:text-[#800020] px-3 py-2 text-sm font-medium">
              Sign in
            </Link>
            <Link to="/login" className="group bg-[#800020] text-white hover:bg-[#600018] px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </header>
    <main className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Your Personal
            <div className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#800020] to-[#B22222] text-transparent bg-clip-text">
                {' '}
                Study Assistant
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-red-100 to-amber-100 rounded-lg transform -skew-y-2" />
            </div>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Stay organized, track your progress, and get personalized support
            with StudyBuddy. The smart way to manage your academic journey.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/login" className="group relative bg-gradient-to-r from-[#800020] to-[#B22222] text-white px-8 py-3 rounded-lg text-lg font-medium transition-all transform hover:scale-105 hover:shadow-lg">
              <span className="relative z-10 flex items-center gap-2">
                Start Free
                <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#600018] to-[#8B0000] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-[#800020] px-8 py-3 rounded-lg text-lg font-medium border border-gray-300 hover:border-[#800020] transition-all hover:shadow-md">
              Learn More
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              icon: CheckCircle,
              color: 'maroon',
              title: 'Task Management',
              description: 'Easily organize and track your assignments, homework, and projects in one place.'
            }, {
              icon: Brain,
              color: 'gold',
              title: 'Emotional Support',
              description: 'Get personalized encouragement and support based on your emotional state.'
            }, {
              icon: Sparkles,
              color: 'maroon',
              title: 'Progress Tracking',
              description: 'Visualize your academic progress and celebrate your achievements.'
            }].map((feature, index) => <div key={feature.title} className={`group bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 ${activeFeature === index ? 'transform -translate-y-1 shadow-md' : 'hover:-translate-y-1 hover:shadow-md'}`} onMouseEnter={() => setActiveFeature(index)} onMouseLeave={() => setActiveFeature(null)}>
              <div className={`${feature.color === 'maroon' ? 'bg-red-50' : 'bg-amber-50'} w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <feature.icon className={`h-6 w-6 ${feature.color === 'maroon' ? 'text-[#800020]' : 'text-[#B8860B]'}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>)}
          </div>
        </div>
      </div>
    </main>
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-500 text-sm">
          © 2025 StudyBuddy. All rights reserved.
        </div>
      </div>
    </footer>
  </div>;
};