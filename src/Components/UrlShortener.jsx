import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import QRCode from 'react-qr-code';
import supabase from '@/db/supabase';
import { Copy, ExternalLink, Calendar, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const UrlShortener = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [urlData, setUrlData] = useState(null);

  // Pre-fill URL from query parameter
  useEffect(() => {
    const createUrl = searchParams.get('createUrl');
    if (createUrl) {
      setLongUrl(createUrl);
    }
  }, [searchParams]);

  // Generate a random short code
  const generateShortCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Validate URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Shorten URL
  const handleShortenUrl = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate URL
      if (!longUrl.trim()) {
        throw new Error('Please enter a URL');
      }

      if (!isValidUrl(longUrl)) {
        throw new Error('Please enter a valid URL');
      }

      // Generate short code
      const shortCode = customAlias.trim() || generateShortCode();
      
      // Check if custom alias already exists
      if (customAlias.trim()) {
        const { data: existingUrl } = await supabase
          .from('urls')
          .select('*')
          .eq('short_code', shortCode)
          .single();

        if (existingUrl) {
          throw new Error('This custom alias is already taken');
        }
      }

      // Save to database
      const urlData = {
        long_url: longUrl,
        short_code: shortCode,
        created_at: new Date().toISOString(),
        clicks: 0
      };

      // Add user_id (always logged in now)
      urlData.user_id = user.id;

      const { data, error: dbError } = await supabase
        .from('urls')
        .insert([urlData])
        .select()
        .single();

      if (dbError) {
        throw new Error(dbError.message);
      }

      // Generate short URL
      const baseUrl = window.location.origin;
      const generatedShortUrl = `${baseUrl}/r/${shortCode}`;
      
      setShortUrl(generatedShortUrl);
      setQrCodeData(generatedShortUrl);
      setUrlData(data);
      setSuccess('URL shortened successfully!');
      
      // Clear form
      setLongUrl('');
      setCustomAlias('');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Copied to clipboard!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  // Download QR Code
  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-code-${urlData?.short_code}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">URL Shortener</h1>
        <p className="text-gray-600">Create short links and QR codes instantly</p>
      </div>

      {/* URL Shortener Form */}
      <Card>
        <CardHeader>
          <CardTitle>Shorten Your URL</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleShortenUrl} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Long URL</label>
              <input
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Custom Alias (Optional)
              </label>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-custom-link"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for auto-generated short code
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </form>

          {/* Error/Success Messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {shortUrl && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Short URL Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Short URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-600 mb-1">Your short URL:</p>
                <p className="font-mono text-lg break-all">{shortUrl}</p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => copyToClipboard(shortUrl)}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy URL
                </Button>
                <Button 
                  onClick={() => window.open(shortUrl, '_blank')}
                  variant="outline"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Test
                </Button>
              </div>

              {urlData && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Created: {new Date(urlData.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Clicks: {urlData.clicks}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center p-4 bg-white rounded-lg border">
                <QRCode
                  id="qr-code-svg"
                  value={qrCodeData}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              
              <Button 
                onClick={downloadQRCode}
                className="w-full"
                variant="outline"
              >
                Download QR Code
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
