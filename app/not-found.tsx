import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-primary text-white px-5 py-2 rounded-md hover:bg-primary-light text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Go to Home
          </Link>
          <Link
            href="/contact"
            className="bg-white border border-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-50 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}