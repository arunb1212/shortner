import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Redirect = () => {
  const { shortCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const redirectToUrl = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Fetch original URL and increment click count in one request
        const res = await fetch(`${baseUrl}/api/urls/r/${shortCode}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Short URL not found');
          setLoading(false);
          return;
        }

        // Redirect to original URL
        window.location.href = data.longUrl;

      } catch (err) {
        setError('An error occurred while redirecting');
        setLoading(false);
      }
    };

    if (shortCode) {
      redirectToUrl();
    }
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default Redirect;