import { Button } from '@/components/ui/button';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import ComparisonSlider from '@/components/ComparisonSlider';

interface LandingPageProps {
  onSignIn: () => void;
}

export default function LandingPage({ onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">CompareYUV</h1>
        <div className="flex items-center gap-4">
          <AnimatedThemeToggler />
          <div className="space-x-4">
            <Button variant="outline" onClick={onSignIn}>
              Sign In
            </Button>
            <Button onClick={onSignIn}>
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Text */}
          <div className="text-center lg:text-left">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              Compare Your{' '}
              <span className="text-blue-600 dark:text-blue-400 relative">
                Before & After
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-60"></div>
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Transform your photos into stunning before-and-after comparisons.
              See your progress with our interactive slider.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={onSignIn}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Column - Interactive Slider Example */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800 p-4">
              <ComparisonSlider
                beforeImage="https://raw.githubusercontent.com/nerdyman/stuff/main/libs/react-compare-slider/demo-images/lady-2.png"
                afterImage="https://raw.githubusercontent.com/nerdyman/stuff/main/libs/react-compare-slider/demo-images/lady-1.png"
                className="w-full aspect-[4/5] rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl pointer-events-none" />
              <p className="absolute bottom-6 left-6 text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                Try dragging the slider
              </p>
            </div>

            {/* Floating animation hint */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Why Choose CompareYUV?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of users transforming their photos into compelling visual stories
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Easy Upload</h3>
            <p className="text-gray-600 dark:text-gray-300">Upload your before and after images with just a few clicks</p>
          </div>

          <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Instant Comparison</h3>
            <p className="text-gray-600 dark:text-gray-300">See your progress side-by-side with interactive comparisons</p>
          </div>

          <div className="text-center p-6 group hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Share & Connect</h3>
            <p className="text-gray-600 dark:text-gray-300">Share your journey and connect with others on similar paths</p>
          </div>
        </div>
      </div>
    </div>
  );
}
