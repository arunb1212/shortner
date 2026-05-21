import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import Accrodian from "@/Components/Accrodian";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Link2, Sparkles, Shield, BarChart3, Zap } from "lucide-react";

const Home = () => {
  const [longurl, setLongurl] = useState("");
  const navigate = useNavigate();

  const handleshortener = (e) => {
    e.preventDefault();
    if (longurl) {
      navigate(`/login?createUrl=${encodeURIComponent(longurl)}`);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-16 px-4 overflow-hidden bg-gradient-to-b from-[#f9fafb] to-white">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-zinc-100 rounded-full blur-[120px] opacity-70 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-4xl text-center space-y-6 animate-slide-up">
        
        {/* Sparkle Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-zinc-200 rounded-full shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
          <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider">Introducing Trimmr v4.0</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1] max-w-3xl mx-auto">
          The only link shortener you'll ever need.
        </h1>
        
        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-500 max-w-xl mx-auto">
          Simplify your links, track real-time audience analytics, and generate beautiful brand assets. Premium link management for teams.
        </p>

        {/* Shorten Input Card */}
        <div className="w-full max-w-2xl mx-auto bg-white border border-zinc-100 p-4 sm:p-5 rounded-2xl shadow-premium-lg mt-8">
          <form onSubmit={handleshortener} className="flex flex-col sm:flex-row items-center w-full gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Link2 className="w-4 h-4 text-zinc-400" />
              </div>
              <input
                type="url"
                value={longurl}
                required
                placeholder="Paste your long link here (e.g., https://example.com/very-long-url)"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:bg-white focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition-all font-medium"
                onChange={(e) => setLongurl(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-premium flex items-center justify-center gap-2 group shrink-0"
            >
              <span>Shorten Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
          <p className="text-[10px] text-zinc-400 mt-3 text-center sm:text-left sm:pl-3">
            Sign up to unlock custom branding, analytics tracking, and QR code downloads.
          </p>
        </div>
      </div>

      {/* Feature Badges Section */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full mt-16 px-4 animate-fade-in">
        <div className="bg-white border border-zinc-100 p-5 rounded-xl shadow-premium flex items-start gap-4">
          <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-zinc-900" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-950">Instant Redirects</h3>
            <p className="text-xs text-zinc-500 mt-1">Blazing-fast global routing redirects your visitors in milliseconds.</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 p-5 rounded-xl shadow-premium flex items-start gap-4">
          <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 text-zinc-900" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-950">Deep Analytics</h3>
            <p className="text-xs text-zinc-500 mt-1">Understand your click-through counts and visual traffic trends instantly.</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 p-5 rounded-xl shadow-premium flex items-start gap-4">
          <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-zinc-900" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-950">Secure Links</h3>
            <p className="text-xs text-zinc-500 mt-1">Enterprise-grade link checking keeps your users safe from spam.</p>
          </div>
        </div>
      </div>

      {/* Accordion FAQ Area */}
      <Accrodian />
    </div>
  );
};

export default Home;
