import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/Components/ui/button';
import QRCode from 'react-qr-code';
import api from '@/lib/api';
import { Copy, ExternalLink, Calendar, BarChart3, Link2, Sparkles, QrCode, Download, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { BeatLoader } from 'react-spinners';

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
  const [copied, setCopied] = useState(false);

  // Pre-fill URL from query parameter
  useEffect(() => {
    const createUrl = searchParams.get('createUrl');
    if (createUrl) {
      setLongUrl(createUrl);
    }
  }, [searchParams]);

  // Shorten URL
  const handleShortenUrl = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    setCopied(false);

    try {
      const data = await api.post('/api/urls', {
        longUrl: longUrl.trim(),
        customAlias: customAlias.trim() || undefined,
      });

      const baseUrl = window.location.origin;
      const generatedShortUrl = `${baseUrl}/r/${data.shortCode}`;

      setShortUrl(generatedShortUrl);
      setQrCodeData(generatedShortUrl);
      setUrlData(data);
      setSuccess('URL shortened successfully!');

      setLongUrl('');
      setCustomAlias('');
    } catch (err) {
      setError(err.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  // Download QR Code
  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    
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
      downloadLink.download = `qr-code-${urlData?.shortCode || 'short'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
      {/* Header */}
      <div className="text-center sm:text-left space-y-1 pb-4 border-b">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">URL Shortener</h1>
        <p className="text-xs text-zinc-500">Create condensed short links, track routing, and generate QR code assets instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* URL Form Card - Left Column */}
        <div className="lg:col-span-3 bg-white border border-zinc-100 p-6 rounded-2xl shadow-premium">
          <h3 className="text-sm font-bold text-zinc-950 mb-4 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-zinc-500" />
            <span>Shorten New Link</span>
          </h3>

          <form onSubmit={handleShortenUrl} className="space-y-4">
            
            {/* Long URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Long URL</label>
              <input
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/very-long-and-complex-url-path"
                className="w-full outline-none border h-[42px] bg-zinc-50 border-zinc-200 rounded-xl px-4 text-xs font-semibold placeholder-zinc-400 focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition-all"
                required
              />
            </div>

            {/* Custom Alias Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-700">Custom Alias (Optional)</label>
                <span className="text-[10px] text-zinc-400 font-semibold">Auto-generates if empty</span>
              </div>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="e.g. spring-campaign"
                className="w-full outline-none border h-[42px] bg-zinc-50 border-zinc-200 rounded-xl px-4 text-xs font-semibold placeholder-zinc-400 focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[42px] bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-premium"
            >
              {loading ? <BeatLoader size={8} color="#ffffff" /> : "Shorten URL"}
            </button>
          </form>

          {/* Feedback alerts */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2.5 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></span>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold rounded-xl flex items-center gap-2.5 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full shrink-0"></span>
              <p>{success}</p>
            </div>
          )}
        </div>

        {/* Info Helper Sidebar - Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-zinc-800" />
              <span>Pro Branding Tips</span>
            </h4>
            <div className="space-y-3 text-[11px] leading-relaxed text-zinc-600">
              <p>
                <strong>Keep it short:</strong> Try to use 2-3 words for custom aliases. Shorter links are easier to type and print.
              </p>
              <p>
                <strong>SSO tracking:</strong> Ensure you prefix your aliases with campaign tags to aggregate clicks inside Sisyphus Ventures databases.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results View */}
      {shortUrl && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up pt-4">
          
          {/* Result Card */}
          <div className="bg-white border border-zinc-100 p-6 rounded-2xl shadow-premium flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Generated Short link</span>
                </h3>
                <span className="text-[10px] font-bold text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded border">
                  /{urlData?.shortCode}
                </span>
              </div>

              {/* Display Box */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Short URL</p>
                <p className="font-mono text-sm font-bold text-zinc-900 break-all">{shortUrl}</p>
              </div>

              {/* Date Metadata */}
              {urlData && (
                <div className="flex gap-4 mt-4 text-[10px] text-zinc-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created: {new Date(urlData.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Clicks: {urlData.clicks} hits</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Row */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => copyToClipboard(shortUrl)}
                className={`flex-1 h-[38px] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                  copied 
                    ? 'bg-green-700 text-white shadow-sm' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-premium'
                }`}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-[38px] border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Link</span>
              </a>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="bg-white border border-zinc-100 p-6 rounded-2xl shadow-premium flex flex-col justify-between items-center text-center">
            <div className="w-full">
              <div className="flex items-center justify-between border-b pb-4 mb-4 w-full">
                <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-zinc-500" />
                  <span>Download QR Asset</span>
                </h3>
              </div>
              
              {/* QR frame */}
              <div className="inline-block p-4 bg-white border border-zinc-100 rounded-xl shadow-inner mb-2">
                <QRCode
                  id="qr-code-svg"
                  value={qrCodeData}
                  size={120}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
            </div>

            <button
              onClick={downloadQRCode}
              className="w-full h-[38px] border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all mt-4"
            >
              <Download className="w-3.5 h-3.5 text-zinc-700" />
              <span>Download PNG Image</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default UrlShortener;
