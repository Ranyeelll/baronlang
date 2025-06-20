import React, { useState } from 'react';
import { BookOpen, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
export const Login = () => {
  const {
    login,
    signup
  } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }
        await signup(name, email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-red-100">
        <div className="flex flex-col items-center">
          <div className="bg-red-50 p-3 rounded-full">
            <BookOpen className="h-8 w-8 text-[#800020]" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Sign in to access your dashboard' : 'Get started with StudyBuddy'}
          </p>
        </div>
        {error && <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input id="name" type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="Juan Dela Cruz" disabled={isLoading} />
            </div>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="username@gmail.com" disabled={isLoading} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm pr-10" placeholder="Enter your password" disabled={isLoading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {!isLogin && <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm pr-10" placeholder="Confirm your password" disabled={isLoading} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>}
          {isLogin && <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md"></div>}
          <div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800020] hover:bg-[#600018] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800020] disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLogin ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </form>
        <div className="text-center space-y-4">
          <button onClick={() => {
          setIsLogin(!isLogin);
          setError('');
          setConfirmPassword('');
        }} className="text-sm text-[#800020] hover:text-[#600018]" disabled={isLoading}>
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
          <div>
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-700">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>;
};