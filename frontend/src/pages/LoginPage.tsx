import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Mail } from 'lucide-react';
import { useUserContext } from '../contexts/UserContext';
import { Button } from '../components/ui';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, login, loading } = useUserContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!email) {
        throw new Error('Please enter your email');
      }

      if (!password) {
        throw new Error('Please enter password');
      }

      // 通过邮箱查找用户
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (!user) {
        throw new Error('User not found');
      }

      if (password !== '1234') {
        throw new Error('Incorrect password');
      }

      await login(user.id, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 根据输入的邮箱预测用户
  const predictedUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your Task Tiles account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  disabled={loading}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Predicted User Preview */}
            {predictedUser && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                    {predictedUser.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">
                      {predictedUser.name}
                    </p>
                    <p className="text-sm text-blue-600">
                      {predictedUser.role}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="Enter password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              loading={isSubmitting}
              disabled={loading || !email || !password}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Demo Accounts
            </h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <span>👰‍♀️</span>
                <span>emma@techstart.com - HR Manager & Bride</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🤵‍♂️</span>
                <span>david@example.com - Groom</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>👩‍💼</span>
                <span>yilian@techstart.com - HR Colleague</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
