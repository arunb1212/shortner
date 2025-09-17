import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Copy, ExternalLink, Trash2, BarChart3, Calendar, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';
import supabase from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';

const UrlManager = () => {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showQRCode, setShowQRCode] = useState(null);

  // Fetch user-specific URLs
  const fetchUrls = async () => {
    try {
      const { data, error } = await supabase
        .from('urls')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUrls(data || []);
    } catch (err) {
      setError('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [user]);

  // Delete URL
  const deleteUrl = async (id) => {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    try {
      const { error } = await supabase
        .from('urls')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUrls(urls.filter(url => url.id !== id));
      setSuccess('URL deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete URL');
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
  const downloadQRCode = (shortUrl, shortCode) => {
    const svg = document.getElementById(`qr-code-${shortCode}`);
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
      downloadLink.download = `qr-code-${shortCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading URLs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Shortened URLs</h2>
        <p className="text-gray-600">Manage and track your shortened links</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* URLs List */}
      {urls.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">No URLs found</p>
            <p className="text-gray-400">Create your first shortened URL above!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {urls.map((url) => {
            const shortUrl = `${window.location.origin}/r/${url.short_code}`;
            
            return (
              <Card key={url.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {url.short_code}
                      </CardTitle>
                      <p className="text-sm text-gray-600 break-all">
                        {url.long_url}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteUrl(url.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Short URL */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Short URL:</p>
                      <p className="font-mono text-sm break-all">{shortUrl}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>{url.clicks} clicks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(url.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(shortUrl)}
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(shortUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowQRCode(showQRCode === url.id ? null : url.id)}
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        QR
                      </Button>
                    </div>

                    {/* QR Code */}
                    {showQRCode === url.id && (
                      <div className="mt-4 p-4 bg-white rounded-lg border">
                        <div className="flex justify-center mb-4">
                          <QRCode
                            id={`qr-code-${url.short_code}`}
                            value={shortUrl}
                            size={150}
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadQRCode(shortUrl, url.short_code)}
                          className="w-full"
                        >
                          Download QR Code
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UrlManager;
