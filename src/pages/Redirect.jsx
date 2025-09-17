import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '@/db/supabase';
import { Loader2 } from 'lucide-react';

const Redirect = () => {
  const { shortCode } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const redirectToUrl = async () => {
      try {
        // Get URL from database
        const { data, error: dbError } = await supabase
          .from('urls')
          .select('long_url, clicks')
          .eq('short_code', shortCode)
          .single();

        if (dbError || !data) {
          setError('Short URL not found');
          setLoading(false);
          return;
        }

        // Update click count
        await supabase
          .from('urls')
          .update({ clicks: data.clicks + 1 })
          .eq('short_code', shortCode);

        // Redirect to original URL
        window.location.href = data.long_url;

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