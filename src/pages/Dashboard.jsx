import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import QRCode from 'react-qr-code';
import {
  BarChart3,
  Link2,
  MousePointerClick,
  TrendingUp,
  Calendar,
  ExternalLink,
  Copy,
  AlertCircle,
  Database,
  Layers,
  Globe,
  Bell,
  Shield,
  UserCheck,
  CreditCard,
  Download,
  Upload,
  Settings,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Trash2,
  QrCode
} from 'lucide-react';

const MOCK_URLS = [
  {
    _id: 'mock-1',
    shortCode: 'spring-sale',
    longUrl: 'https://sisyphusventures.com/campaigns/2026/spring-sale-mega-discount-active',
    clicks: 1242,
    createdAt: '2026-05-18T10:00:00Z'
  },
  {
    _id: 'mock-2',
    shortCode: 'pitch-deck',
    longUrl: 'https://docs.google.com/presentation/d/1aSdFlakdjwka01k23kjasdqw/edit',
    clicks: 894,
    createdAt: '2026-05-16T14:30:00Z'
  },
  {
    _id: 'mock-3',
    shortCode: 'hiring-role',
    longUrl: 'https://jobs.lever.co/sisyphus-ventures/senior-frontend-engineer-remote',
    clicks: 431,
    createdAt: '2026-05-15T09:15:00Z'
  },
  {
    _id: 'mock-4',
    shortCode: 'api-docs',
    longUrl: 'https://docs.sisyphus.io/reference/api/v4/endpoints/url-shortener',
    clicks: 188,
    createdAt: '2026-05-14T11:00:00Z'
  }
];

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');

  // Real database metrics with static showcase fallback
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [showQRCodeId, setShowQRCodeId] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const data = await api.get('/api/urls');
        if (data && data.length > 0) {
          setUrls(data);
        } else {
          setUrls(MOCK_URLS);
        }
      } catch (err) {
        setUrls(MOCK_URLS);
      } finally {
        setLoading(false);
      }
    };
    fetchUrls();
  }, [view]); // Refetch when transitioning views

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
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

  // Click statistics calculations
  const totalLinks = urls.length;
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const topUrl = urls.length > 0 ? [...urls].sort((a, b) => b.clicks - a.clicks)[0] : null;

  // Render dynamic setting view if defined
  if (view) {
    return (
      <div className="space-y-6 animate-slide-up">
        {/* view switch header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-zinc-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 capitalize">
              {view.replace('-', ' ')}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Configure and audit your {view.replace('-', ' ')} settings here.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="text-xs font-bold text-zinc-600 hover:text-zinc-950 flex items-center gap-1.5 py-1.5 px-3 bg-white border border-zinc-200 rounded-lg shadow-sm w-fit"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>Return to Dashboard</span>
          </Link>
        </div>

        {/* Dynamic Panels */}
        {view === 'appearance' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-premium max-w-2xl space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              Theme Customization
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-zinc-900 bg-white p-4 rounded-xl shadow-sm cursor-pointer space-y-3">
                <div className="w-full h-24 bg-[#f8f9fa] border rounded-lg flex items-center justify-center">
                  <div className="w-4/5 h-16 bg-white border rounded shadow-sm flex p-1.5 gap-1.5">
                    <div className="w-6 h-full bg-zinc-100 rounded"></div>
                    <div className="flex-1 space-y-1.5">
                      <div className="w-full h-2 bg-zinc-200 rounded"></div>
                      <div className="w-2/3 h-2 bg-zinc-100 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-900">Light theme (Mockup)</span>
                  <span className="w-3 h-3 bg-zinc-950 rounded-full"></span>
                </div>
              </div>

              <div className="border border-zinc-200 bg-white p-4 rounded-xl hover:border-zinc-300 cursor-pointer opacity-50 space-y-3">
                <div className="w-full h-24 bg-zinc-950 border rounded-lg flex items-center justify-center">
                  <div className="w-4/5 h-16 bg-zinc-900 border border-zinc-800 rounded shadow-sm flex p-1.5 gap-1.5">
                    <div className="w-6 h-full bg-zinc-850 rounded"></div>
                    <div className="flex-1 space-y-1.5">
                      <div className="w-full h-2 bg-zinc-800 rounded"></div>
                      <div className="w-2/3 h-2 bg-zinc-850 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500">Dark theme (Pro)</span>
                  <span className="w-3 h-3 border border-zinc-200 rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'database' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-premium max-w-2xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-zinc-500" />
              <span>MongoDB Status</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-zinc-50 border rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Database Connection</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                  <span className="text-sm font-bold text-zinc-900">Connected</span>
                </div>
              </div>
              <div className="p-4 bg-zinc-50 border rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Replica Sets</p>
                <p className="text-sm font-bold text-zinc-900 mt-1">Primary (us-east-1)</p>
              </div>
              <div className="p-4 bg-zinc-50 border rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Collections</p>
                <p className="text-sm font-bold text-zinc-900 mt-1">2 (Users, Urls)</p>
              </div>
              <div className="p-4 bg-zinc-50 border rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Storage Usage</p>
                <p className="text-sm font-bold text-zinc-900 mt-1">1.24 MB / 512 MB</p>
              </div>
            </div>
          </div>
        )}

        {view === 'connections' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-premium max-w-2xl space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-500" />
              <span>API Integrations</span>
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Slack Notifications', desc: 'Post new link triggers directly in channels.', active: true },
                { name: 'Zapier Connector', desc: 'Sync links and click counts with CRM triggers.', active: false },
                { name: 'Webhooks Integration', desc: 'Stream raw real-time click logs to HTTP endpoints.', active: true }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border rounded-xl hover:bg-zinc-50 transition-all">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">{item.name}</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${item.active ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'border hover:bg-zinc-100'}`}>
                    {item.active ? 'Active' : 'Integrate'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'timezones' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-premium max-w-lg space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-zinc-500" />
              <span>Localization & Timezone</span>
            </h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Report Timezone</label>
                <select className="w-full px-3 py-2 bg-zinc-50 border rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-zinc-950">
                  <option>Coordinated Universal Time (UTC +0:00)</option>
                  <option selected>Indian Standard Time (IST +5:30)</option>
                  <option>Eastern Standard Time (EST -5:00)</option>
                  <option>Greenwich Mean Time (GMT +0:00)</option>
                </select>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-zinc-50 border rounded-xl mt-3">
                <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full shrink-0"></span>
                <p className="text-[10px] leading-relaxed text-zinc-500">
                  This sets the default timestamp presentation for shortened link click metrics and recent activity dashboard reports.
                </p>
              </div>
            </div>
          </div>
        )}

        {view === 'notifications' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-premium max-w-2xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-zinc-500" />
              <span>System Alerts</span>
            </h3>
            <div className="space-y-3 pt-2">
              <div className="flex gap-4 p-4 bg-zinc-50 border border-zinc-200 rounded-xl items-start">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-950">Database Migrated Successful</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Schema versions successfully migrated to v4.2.14.</p>
                  <span className="text-[9px] text-zinc-400 font-semibold block mt-1.5">2 hours ago</span>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-zinc-50 border border-zinc-200 rounded-xl items-start">
                <div className="w-8 h-8 rounded-lg bg-zinc-200 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-zinc-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-950">New Traffic Peak Detected</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Your shortened URL click throughput increased by 40% in the last 24h.</p>
                  <span className="text-[9px] text-zinc-400 font-semibold block mt-1.5">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'security' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-premium max-w-2xl space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-500" />
              <span>Security Configurations</span>
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-xl hover:bg-zinc-50">
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Add an extra layer of security to your Trimmr user account.</p>
                </div>
                <div className="w-10 h-6 bg-zinc-200 rounded-full p-1 cursor-pointer flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full transition-all shadow-sm"></div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-xl hover:bg-zinc-50">
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">API Key Rotation Schedule</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Automatically trigger tokens rotation every 90 days.</p>
                </div>
                <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">Enabled</span>
              </div>
            </div>
          </div>
        )}

        {view === 'auth-settings' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-premium max-w-lg space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-zinc-500" />
              <span>OAuth & Identity Providers</span>
            </h3>
            <p className="text-xs text-zinc-500">Enable modern logins for your organization team members.</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 border rounded-xl hover:bg-zinc-50 cursor-pointer space-y-2.5 flex flex-col">
                <span className="text-xs font-bold text-zinc-950">Google Workspace SSO</span>
                <span className="text-[9px] text-green-700 bg-green-50 px-2 py-0.5 rounded font-bold w-fit mt-auto">Active</span>
              </div>
              <div className="p-4 border rounded-xl hover:bg-zinc-50 cursor-pointer opacity-50 space-y-2.5 flex flex-col">
                <span className="text-xs font-bold text-zinc-950">GitHub SSO</span>
                <span className="text-[9px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded font-bold w-fit mt-auto">Configure</span>
              </div>
            </div>
          </div>
        )}

        {view === 'payments' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-premium max-w-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-zinc-500" />
                  <span>Sisyphus Ventures Subscriptions</span>
                </h3>
                <p className="text-[10px] text-zinc-500 mt-1">Billing managed dynamically on Trimmer Enterprise portals.</p>
              </div>
              <span className="text-[10px] font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg">Enterprise Account</span>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-zinc-900">Current Plan Rate</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Unlimited URLs shortening, dedicated SSL, SLA guarantees.</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-zinc-950">$249</span>
                <span className="text-[10px] text-zinc-400 font-semibold block">per month</span>
              </div>
            </div>
          </div>
        )}

        {view === 'import' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-premium max-w-2xl space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-zinc-500" />
              <span>Import URLs in Bulk</span>
            </h3>
            <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-300 cursor-pointer rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-2">
              <Upload className="w-6 h-6 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-950">Upload CSV or JSON file</span>
              <p className="text-[10px] text-zinc-400">File size up to 10MB. Must contain columns: longUrl and optional customAlias.</p>
            </div>
          </div>
        )}

        {view === 'export' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-premium max-w-2xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-zinc-500" />
              <span>Export Asset Database</span>
            </h3>
            <p className="text-xs text-zinc-500">Select format to download the complete directory of your shortened URLs.</p>
            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shadow-premium">
                Export as CSV
              </button>
              <button className="flex-1 py-3 px-4 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl text-xs font-bold">
                Export as JSON
              </button>
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-premium max-w-lg space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-zinc-500" />
              <span>System Settings</span>
            </h3>
            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Dashboard Name</label>
                <input
                  type="text"
                  defaultValue="Sisyphus Ventures Link Hub"
                  className="w-full px-3 py-2 border rounded-xl text-xs font-semibold outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Primary Redirect Domain</label>
                <input
                  type="text"
                  defaultValue="trimmr.co"
                  disabled
                  className="w-full px-3 py-2 bg-zinc-50 border rounded-xl text-xs font-semibold text-zinc-400"
                />
              </div>
              <button className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shadow-premium mt-2">
                Save Changes
              </button>
            </div>
          </div>
        )}

        {view === 'docs' && (
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-premium max-w-2xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-zinc-500" />
              <span>Developer Reference Guides</span>
            </h3>
            <div className="space-y-3">
              <p className="text-xs text-zinc-500 leading-relaxed">
                Shorten URLs programmatically via our lightweight POST endpoint. Add the Bearer API Key inside request headers.
              </p>
              <div className="p-4 bg-zinc-950 text-zinc-100 rounded-xl font-mono text-[10px] overflow-x-auto space-y-1">
                <p className="text-zinc-500"># Create short URL</p>
                <p><span className="text-yellow-400">curl</span> -X POST http://localhost:5000/api/urls \</p>
                <p>  -H <span className="text-green-400">"Authorization: Bearer YOUR_TOKEN"</span> \</p>
                <p>  -H <span className="text-green-400">"Content-Type: application/json"</span> \</p>
                <p>  -d <span className="text-green-400">'{'{"longUrl": "https://example.com"}'}'</span></p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render the Default Dashboard View (Metrics, Graphs, and Recent Links)
  return (
    <div className="space-y-8 animate-slide-up">

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Analytics Dashboard</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Monitor click statistics, routing throughput, and link operations in real-time.
          </p>
        </div>

        <Link
          to="/create-link"
          className="text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 py-2.5 px-4 rounded-xl shadow-premium flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Generate New URL</span>
        </Link>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white border border-zinc-100 p-5 rounded-xl shadow-premium space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-zinc-500">Total Shortened Links</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-zinc-700" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-zinc-950">{loading ? '...' : totalLinks}</h3>
            <p className="text-[10px] text-green-700 font-semibold mt-1 flex items-center gap-1">
              <span>+12% this week</span>
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-zinc-100 p-5 rounded-xl shadow-premium space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-zinc-500">Total Redirect Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4 text-zinc-700" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-zinc-950">{loading ? '...' : totalClicks}</h3>
            <p className="text-[10px] text-green-700 font-semibold mt-1 flex items-center gap-1">
              <span>+38% vs last month</span>
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-zinc-100 p-5 rounded-xl shadow-premium space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-zinc-500">Top Performing Asset</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-zinc-700" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-950 truncate max-w-[200px]">
              {loading ? '...' : (topUrl ? topUrl.shortCode : 'None')}
            </h3>
            <p className="text-[10px] text-zinc-500 font-semibold mt-1">
              {topUrl ? `${topUrl.clicks} total hits` : 'Create links to track'}
            </p>
          </div>
        </div>
      </div>

      {/* SVG Interactive Click Trend Chart */}
      <div className="bg-white border border-zinc-100 rounded-xl p-6 shadow-premium space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-950">Click Activity Metrics</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">Timeline chart representing total click throughput counts.</p>
          </div>
          <span className="text-[10px] font-bold text-zinc-900 bg-zinc-50 border px-3 py-1 rounded-lg">Last 7 Days</span>
        </div>

        {/* Dynamic Curved Area Chart in raw SVG */}
        <div className="h-64 w-full flex items-end justify-center relative pt-6 px-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="50" x2="700" y2="50" stroke="#f1f3f5" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="0" y1="100" x2="700" y2="100" stroke="#f1f3f5" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="0" y1="150" x2="700" y2="150" stroke="#f1f3f5" strokeWidth="1" strokeDasharray="4,4" />

            {/* Curved Path */}
            <path
              d="M 0,180 C 100,160 200,80 300,110 C 400,140 500,40 600,60 C 650,70 700,50 700,50 L 700,200 L 0,200 Z"
              fill="url(#chartGradient)"
              opacity="0.12"
            />
            <path
              d="M 0,180 C 100,160 200,80 300,110 C 400,140 500,40 600,60 C 650,70 700,50 700,50"
              fill="none"
              stroke="oklch(0.21 0.01 240)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.21 0.01 240)" />
                <stop offset="100%" stopColor="oklch(0.21 0.01 240)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Accent dots on path */}
            <circle cx="300" cy="110" r="5" fill="oklch(0.21 0.01 240)" stroke="#ffffff" strokeWidth="2" />
            <circle cx="600" cy="60" r="5" fill="oklch(0.21 0.01 240)" stroke="#ffffff" strokeWidth="2" />
          </svg>

          {/* Axis Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 text-[9px] font-bold text-zinc-400 pt-2 border-t">
            <span>May 14</span>
            <span>May 15</span>
            <span>May 16</span>
            <span>May 17</span>
            <span>May 18</span>
            <span>May 19</span>
            <span>May 20 (Today)</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-zinc-100 rounded-xl p-5 shadow-premium space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-950">Recent Links Created</h3>
          <p className="text-[10px] text-zinc-400 mt-0.5">Quick lookup and performance tracker of your latest shortened links.</p>
        </div>

        {urls.length === 0 ? (
          <div className="py-8 text-center border border-dashed rounded-xl space-y-2 bg-zinc-50/50">
            <AlertCircle className="w-5 h-5 text-zinc-400 mx-auto" />
            <h4 className="text-xs font-bold text-zinc-900">No active assets found</h4>
            <p className="text-[10px] text-zinc-500 max-w-[240px] mx-auto">Shorten links programmatically or inside the Shortener Tab to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-100 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-bold">
                  <th className="p-3">Short URL Alias</th>
                  <th className="p-3">Long Destination Link</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">Date Added</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-600">
                {urls.slice(0, 4).map((url) => {
                  const shortLink = `${window.location.origin}/r/${url.shortCode}`;
                  return (
                    <React.Fragment key={url._id}>
                      <tr className="hover:bg-zinc-50/50 transition-all font-medium">
                        <td className="p-3">
                          <span className="font-bold text-zinc-950 font-mono">/{url.shortCode}</span>
                        </td>
                        <td className="p-3 max-w-[220px] truncate text-zinc-400">
                          {url.longUrl}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded-full font-bold font-mono text-[10px]">
                            {url.clicks} clicks
                          </span>
                        </td>
                        <td className="p-3 text-zinc-400">
                          {new Date(url.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            {/* Copy button */}
                            <button
                              onClick={() => copyToClipboard(shortLink, url._id)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                copiedId === url._id
                                  ? 'bg-green-700 border-green-700 text-white'
                                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950'
                              }`}
                              title="Copy link"
                            >
                              {copiedId === url._id ? <CheckCircle2 className={`w-3.5 h-3.5 ${copiedId === url._id ? 'text-white' : 'text-green-600'}`} /> : <Copy className="w-3.5 h-3.5" />}
                            </button>

                            {/* Test redirect link */}
                            <a
                              href={shortLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 border border-zinc-200 bg-white text-zinc-600 rounded-lg hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
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
                                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950'
                              }`}
                              title="Toggle QR Code"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Dropdown QR Code Drawer */}
                      {showQRCodeId === url._id && (
                        <tr>
                          <td colSpan="5" className="bg-zinc-50/50 p-4 border-b border-zinc-100">
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
                                <p className="text-[10px] text-zinc-500 max-w-xs font-semibold">
                                  Scan to redirect to target site, or download this image asset to share offline.
                                </p>
                                <button
                                  onClick={() => downloadQRCode(url.shortCode)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-[10px] font-bold text-zinc-800 rounded-lg shadow-sm transition-all cursor-pointer"
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
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;