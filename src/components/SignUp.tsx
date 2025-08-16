import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignUpEmailPassword } from '@nhost/react';
import { Bot, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  const [success, setSuccess] = useState(false);
  
  const { signUpEmailPassword, isLoading, error } = useSignUpEmailPassword();

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await signUpEmailPassword(email, password);
      if (result.error) {
        setErrors({ general: result.error.message });
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="w-full max-w-md text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl mb-6 shadow-2xl shadow-green-500/30 animate-bounce-subtle">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Welcome to ChatMind AI!
            </h1>
            <p className="text-gray-400 mb-6">
              Your account has been created successfully. You're ready to start your AI-powered conversations.
            </p>
            <Link 
              to="/signin" 
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transform"
            >
              Start Chatting
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl mb-6 shadow-2xl shadow-orange-500/30 animate-bounce-subtle">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <div className="flex items-center justify-center mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              ChatMind AI
            </h1>
            <Sparkles className="w-6 h-6 text-orange-400 ml-2 animate-twinkle" />
          </div>
          <p className="text-orange-400 font-medium mb-2">Your Intelligent Conversation Partner</p>
          <p className="text-gray-400 text-sm">Join thousands of users experiencing the future of AI chat</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 animate-shake">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 animate-shake">
              <p className="text-red-400 text-sm">{error.message}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-0 transition-colors ${
                  errors.name 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : 'border-gray-600 focus:border-orange-500'
                }`}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-0 transition-colors ${
                  errors.email 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : 'border-gray-600 focus:border-orange-500'
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-0 transition-colors ${
                  errors.password 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : 'border-gray-600 focus:border-orange-500'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-400 disabled:to-orange-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transform"
          >
            {isLoading ? 'Creating your AI account...' : 'Start Your AI Journey'}
          </button>

          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/signin" 
                className="text-orange-400 hover:text-orange-300 font-medium transition-all duration-200 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;