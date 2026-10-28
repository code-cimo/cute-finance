import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mascot } from './Mascot';

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Username and password are required');
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (!email) {
        setError('Email is required');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const success = await register(username, email, password);
      if (!success) {
        setError('Registration failed. Username or email may already exist.');
      }
    } else {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-yellow via-pastel-cream to-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo & Mascot */}
        <div className="text-center mb-8">
          <div className="animate-float mb-4">
            <Mascot type="capybara" size={100} animate />
          </div>
          <h1 className="text-3xl font-extrabold text-cute-brown">CuteFinance</h1>
          <p className="text-cute-brown/60 mt-2">Your adorable finance companion 🐾</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                isLogin ? 'bg-pastel-pink text-white shadow-sm' : 'text-cute-brown/60'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                !isLogin ? 'bg-pastel-mint text-white shadow-sm' : 'text-cute-brown/60'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="text-sm font-bold text-cute-brown block mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-cute-brown border-2 border-transparent focus:border-pastel-pink"
                disabled={loading}
              />
            </div>

            {/* Email (Register only) */}
            {!isLogin && (
              <div>
                <label className="text-sm font-bold text-cute-brown block mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-cute-brown border-2 border-transparent focus:border-pastel-pink"
                  disabled={loading}
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="text-sm font-bold text-cute-brown block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-cute-brown border-2 border-transparent focus:border-pastel-pink"
                disabled={loading}
              />
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div>
                <label className="text-sm font-bold text-cute-brown block mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-cute-brown border-2 border-transparent focus:border-pastel-pink"
                  disabled={loading}
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
                <p className="text-sm text-red-500 font-semibold">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-base text-white shadow-lg active:scale-95 transition-all ${
                loading ? 'bg-gray-300' : isLogin ? 'bg-pastel-pink' : 'bg-pastel-mint'
              }`}
            >
              {loading ? 'Please wait...' : isLogin ? 'Login 🐾' : 'Register 🎉'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-cute-brown/50">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-pastel-pink font-bold"
              >
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-cute-brown/40">
            Free to use • No cost • Your data is safe 🐾
          </p>
        </div>
      </div>
    </div>
  );
};
