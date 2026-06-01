import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="text-center max-w-md mx-auto">
        <AlertTriangle size={64} className="text-yellow-500 mx-auto mb-4" />
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 text-sm md:text-base">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition"
        >
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;