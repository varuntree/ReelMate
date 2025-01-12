import { SignupFormDemo } from "../app-components/ui/SigninForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side - Sign in form */}
        <div>
          <SignupFormDemo />
        </div>

        {/* Right side - Content creators message */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-6 p-8">
          <div className="flex -space-x-2">
            {/* Sample avatar placeholders - replace with actual images */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-secondary"
                style={{ transform: `translateX(-${i * 4}px)` }}
              />
            ))}
          </div>
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-center">
            Join Thousands Of Content Creators
          </h2>
          <p className="text-center text-gray-600">
            Who use ReelMate to create and share their stories.
          </p>
        </div>
      </div>
    </div>
  );
} 