import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import Loginform from '@/Components/ui/Loginform';
import Signupform from '@/Components/ui/signupform';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, ArrowLeft, KeyRound } from 'lucide-react';

const Login = () => {
  const [searchparams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(searchparams.get("tab") || "Login");

  // Redirect to Links if already logged in
  useEffect(() => {
    if (user) {
      const createUrl = searchparams.get('createUrl');
      if (createUrl) {
        navigate(`/Links?createUrl=${encodeURIComponent(createUrl)}`);
      } else {
        navigate('/Links');
      }
    }
  }, [user, navigate, searchparams]);

  // Synchronize tab with query parameters if modified
  useEffect(() => {
    const tab = searchparams.get("tab");
    if (tab === "SignUp" || tab === "Login") {
      setActiveTab(tab);
    }
  }, [searchparams]);

  const handleAuth = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { Email, Password } = formData;
      const result = await signIn(Email, Password);

      if (result.error) {
        setError(result.error.message || 'Failed to authenticate');
      } else {
        setSuccess('Welcome back! Logging in...');
        setTimeout(() => {
          const createUrl = searchparams.get('createUrl');
          if (createUrl) {
            navigate(`/Links?createUrl=${encodeURIComponent(createUrl)}`);
          } else {
            navigate('/Links');
          }
        }, 1000);
      }
    } catch (err) {
      setError('An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { Email, Password } = formData;
      const result = await signUp(Email, Password);

      if (result.error) {
        setError(result.error.message || 'Failed to create account');
      } else {
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/Links');
        }, 1500);
      }
    } catch (err) {
      setError('An unexpected error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-12 px-4 bg-gradient-to-b from-[#f9fafb] to-white overflow-hidden">
      {/* Decorative Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
      
      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-8 left-6 sm:left-12 flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors py-2 px-3 hover:bg-zinc-100 rounded-lg"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to home</span>
      </Link>

      <div className="relative z-10 w-full max-w-[440px] space-y-6 animate-slide-up">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            {searchparams.get("createUrl") ? "Sign in to save your link" : "Access your dashboard"}
          </h1>
          <p className="text-xs text-zinc-500">
            {searchparams.get("createUrl") 
              ? "A free Trimmr account is required to generate short codes and access analytics." 
              : "Welcome back! Enter your details to manage your shortened assets."
            }
          </p>
        </div>

        {/* Auth Tab Container */}
        <div className="bg-white border border-zinc-100 rounded-2xl shadow-premium-lg p-6">
          <Tabs value={activeTab} onValueChange={(v) => {
            setActiveTab(v);
            navigate(searchparams.get("createUrl") ? `/login?createUrl=${encodeURIComponent(searchparams.get("createUrl"))}&tab=${v}` : `/login?tab=${v}`);
          }} className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-zinc-100 p-1 rounded-xl mb-6">
              <TabsTrigger
                value="Login"
                className={`py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'Login' ? 'bg-white shadow-sm text-zinc-950' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                Log In
              </TabsTrigger>
              <TabsTrigger
                value="SignUp"
                className={`py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'SignUp' ? 'bg-white shadow-sm text-zinc-950' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                Create Account
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="Login" className="focus:outline-none animate-fade-in">
              <Loginform onSubmit={handleAuth} loading={loading} />
            </TabsContent>
            
            <TabsContent value="SignUp" className="focus:outline-none animate-fade-in">
              <Signupform onSubmit={handleSignup} loading={loading} />
            </TabsContent>
          </Tabs>

          {/* Inline Feedback Alerts */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 text-xs font-medium rounded-xl flex items-start gap-2.5 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 shrink-0"></span>
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-100 text-green-700 text-xs font-medium rounded-xl flex items-start gap-2.5 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 shrink-0"></span>
              <p>{success}</p>
            </div>
          )}
        </div>

        {/* Small T&C footer */}
        <p className="text-[10px] text-zinc-400 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;