import Link from 'next/link';
import { RainbowButton } from './RainbowButton';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/App Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              REELMATE
            </Link>
          </div>

          {/* Middle Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/pricing" className="text-text hover:text-secondary transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-text hover:text-secondary transition-colors">
              Blog
            </Link>
          </div>

          {/* Sign In Button */}
          <div>
            <RainbowButton>
              Sign In
            </RainbowButton>
          </div>
        </div>
      </div>
    </nav>
  );
} 