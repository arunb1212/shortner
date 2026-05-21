import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UrlShortener from '@/Components/UrlShortener';
import UrlManager from '@/Components/UrlManager';

const Links = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('shorten');

  useEffect(() => {
    // If there's a createUrl parameter, pre-fill the URL shortener
    const createUrl = searchParams.get('createUrl');
    if (createUrl) {
      setActiveTab('shorten');
    }
  }, [searchParams]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('shorten')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shorten'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Shorten URL
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'manage'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Manage URLs
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === 'shorten' ? <UrlShortener /> : <UrlManager />}
      </div>
    </div>
  );
};

export default Links;