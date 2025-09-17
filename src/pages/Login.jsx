import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Loginform from '@/Components/ui/loginform'
import Signupform from '@/Components/ui/signupform'
import { useAuth } from '@/contexts/AuthContext'
const Login = () => {
  const [searchparams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuth = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { Email, Password } = formData;
      
      // For now, we'll use the same function for both login and signup
      // You can modify this based on which tab is active
      const result = await signIn(Email, Password);

      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess('Login successful!');
        // Redirect to Links page or dashboard
        const createUrl = searchparams.get('createUrl');
        if (createUrl) {
          navigate(`/Links?createUrl=${createUrl}`);
        } else {
          navigate('/Links');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
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
        setError(result.error.message);
      } else {
        setSuccess('Account created successfully! You can now sign in.');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center gap-[30px] min-h-screen bg-black'>
      <div className='mt-[30px] text-center'>
        <h1 className="text-4xl font-bold mb-4">
          {searchparams.get("createUrl") ? "Login Required" : "Welcome to Trimmr"}
        </h1>
        <p className="text-lg text-gray-600">
          {searchparams.get("createUrl") 
            ? "Please sign in to shorten your URL" 
            : "Sign in to your account or create a new one"
          }
        </p>
      </div>
      
      <Tabs defaultValue="Login" className="w-[400px]">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="Login">Login</TabsTrigger>
          <TabsTrigger value="SignUp">SignUp</TabsTrigger>
        </TabsList>
        
        <TabsContent value="Login" className="flex flex-col">
          <Loginform onSubmit={handleAuth} loading={loading} />
        </TabsContent>
        
        <TabsContent value="SignUp" className="flex flex-col">
          <Signupform onSubmit={handleSignup} loading={loading} />
        </TabsContent>
      </Tabs>

      {/* Error/Success Messages */}
      {error && (
        <div className="w-[400px] p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="w-[400px] p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

    </div>
  );
}

export default Login