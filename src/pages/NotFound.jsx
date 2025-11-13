import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Text */}
        <h1 className="text-9xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        {/* Message */}
        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Icon */}
        <div className="mb-8">
          <Search className="h-24 w-24 text-slate-300 mx-auto" />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
          <Link to="/add-talent">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Add New Talent
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;