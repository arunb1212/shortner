import React, { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { 
  Copy, 
  ExternalLink, 
  Trash2, 
  BarChart3, 
  Calendar, 
  QrCode, 
  Globe, 
  Search, 
  Check, 
  X, 
  SlidersHorizontal,
  ShieldAlert, 
  Download
} from 'lucide-react';
import QRCode from 'react-qr-code';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { BeatLoader } from 'react-spinners';

const UrlManager = () => {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQRCodeId, setShowQRCodeId] = useState(null);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Dynamic toast
  const [toastMessage, setToastMessage] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Fetch URLs
  const fetchUrls = async () => {
    try {
      const data = await api.get('/api/urls');
      setUrls(data || []);
    } catch (err) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUrls();
    }
  }, [user]);

  // Delete URL action
  const deleteUrl = async (id, shortCode) => {
    if (!confirm(`Are you sure you want to delete /${shortCode}?`)) return;

    try {
      await api.delete(`/api/urls/${id}`);
      setUrls(urls.filter(url => url._id !== id));
      triggerToast(`Short link /${shortCode} deleted successfully`);
    } catch (err) {
      triggerToast('Failed to delete shortened link');
    }
  };

  // Toast trigger
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Copy to clipboard
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      triggerToast('Link copied to clipboard');
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      // Ignore
    }
  };

  // Download QR Code
  const downloadQRCode = (shortCode) => {
    const svg = document.getElementById(`qr-code-table-${shortCode}`);
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
      downloadLink.download = `qr-code-${shortCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  // Filter logic
  const filteredUrls = urls.filter(url => 
    url.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.longUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Checkbox selections
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredUrls.map(u => u._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-3">
          <BeatLoader size={10} color="#151515" />
          <p className="text-xs text-zinc-500 font-semibold">Synchronizing URLs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative animate-slide-up pb-12">
      {/* Title */}
      <div className="flex justify-between items-start pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Manage URLs</h1>
          <p className="text-xs text-zinc-500">Configure, monitor, and copy your shortened campaign link assets.</p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 border border-zinc-100 rounded-xl shadow-premium">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search short code or destination..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold outline-none focus:bg-white focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
          <button className="flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-50 transition-all shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* URL list Table */}
      <div className="bg-white border border-zinc-100 rounded-2xl shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-bold">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={filteredUrls.length > 0 && selectedIds.length === filteredUrls.length}
                    className="w-4 h-4 accent-zinc-950 cursor-pointer rounded border-zinc-300"
                  />
                </th>
                <th className="p-4">Short link alias</th>
                <th className="p-4">Destination long URL</th>
                <th className="p-4">Clicks</th>
                <th className="p-4">Date created</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-600">
              {filteredUrls.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center space-y-2">
                    <ShieldAlert className="w-6 h-6 text-zinc-400 mx-auto" />
                    <h4 className="font-bold text-zinc-900 text-sm">No shortened links found</h4>
                    <p className="text-[10px] text-zinc-500 max-w-xs mx-auto">Shorten links programmatically or inside the Shorten URL tab to populate this directory.</p>
                  </td>
                </tr>
              ) : (
                filteredUrls.map((url) => {
                  const shortLink = `${window.location.origin}/r/${url.shortCode}`;
                  
                  return (
                    <React.Fragment key={url._id}>
                      <tr className="hover:bg-zinc-50/50 transition-all font-medium">
                        {/* Check */}
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(url._id)}
                            onChange={() => handleSelectOne(url._id)}
                            className="w-4 h-4 accent-zinc-950 cursor-pointer rounded border-zinc-300"
                          />
                        </td>
                        
                        {/* Short code alias */}
                        <td className="p-4 font-bold text-zinc-950 font-mono text-xs">
                          /{url.shortCode}
                        </td>
                        
                        {/* Destination URL */}
                        <td className="p-4 max-w-[280px] truncate text-zinc-400 font-semibold">
                          <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                            <span className="truncate">{url.longUrl}</span>
                          </div>
                        </td>

                        {/* Click pill */}
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-800 rounded-full font-bold font-mono text-[10px]">
                            {url.clicks} clicks
                          </span>
                        </td>

                        {/* Created Date */}
                        <td className="p-4 text-zinc-400 text-xs font-semibold">
                          {new Date(url.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right pr-6">
                          <div className="flex justify-end gap-1.5">
                            {/* Copy button */}
                            <button
                              onClick={() => copyToClipboard(shortLink, url._id)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                copiedId === url._id
                                  ? 'bg-green-700 border-green-700 text-white'
                                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                              }`}
                              title="Copy URL"
                            >
                              {copiedId === url._id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            {/* Open button */}
                            <a
                              href={shortLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                              title="Test redirect"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            {/* QR Button */}
                            <button
                              onClick={() => setShowQRCodeId(showQRCodeId === url._id ? null : url._id)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                showQRCodeId === url._id
                                  ? 'bg-zinc-900 border-zinc-900 text-white'
                                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                              }`}
                              title="Toggle QR Code"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => deleteUrl(url._id, url.shortCode)}
                              className="p-1.5 rounded-lg border border-zinc-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                              title="Delete Link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Dropdown QR Code Drawer */}
                      {showQRCodeId === url._id && (
                        <tr>
                          <td colSpan="6" className="bg-zinc-50/50 p-4 border-b border-zinc-100">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 py-2">
                              {/* QR Image */}
                              <div className="p-3 bg-white border border-zinc-200 rounded-xl shadow-sm">
                                <QRCode
                                  id={`qr-code-table-${url.shortCode}`}
                                  value={shortLink}
                                  size={100}
                                />
                              </div>
                              <div className="text-center sm:text-left space-y-2">
                                <h4 className="text-xs font-bold text-zinc-950">QR Code Asset Generated</h4>
                                <p className="text-[10px] text-zinc-500 max-w-xs">
                                  Use this static matrix to share link redirects offline on presentations, graphics, or documents.
                                </p>
                                <button
                                  onClick={() => downloadQRCode(url.shortCode)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-[10px] font-bold text-zinc-800 rounded-lg shadow-sm transition-all"
                                >
                                  <Download className="w-3 h-3 text-zinc-500" />
                                  <span>Download PNG Asset</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bottom Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151515] border border-zinc-800 text-white p-3 rounded-xl shadow-premium-xl flex items-center gap-4 animate-toast max-w-sm">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-zinc-800 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-green-500 stroke-[3px]" />
            </span>
            <p className="text-xs font-semibold text-zinc-200">{toastMessage}</p>
          </div>
          <button
            onClick={() => setToastMessage('')}
            className="text-zinc-500 hover:text-white p-0.5 transition-colors border-l border-zinc-800 pl-3 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};

export default UrlManager;
