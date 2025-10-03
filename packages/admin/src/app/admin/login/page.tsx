'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInAdmin } from '@/lib/auth/adminAuthService';
import { validateEmail, validatePassword, AUTH_ERRORS } from '@eesha/shared';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || AUTH_ERRORS.INVALID_EMAIL);
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.error || AUTH_ERRORS.WEAK_PASSWORD);
      return;
    }

    setIsLoading(true);

    try {
      const { user, error } = await signInAdmin(email, password);

      if (error) {
        setGeneralError(error);
      } else if (user) {
        // Success - redirect to admin dashboard
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (error) {
      setGeneralError(AUTH_ERRORS.UNKNOWN_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-normal text-black mb-2" style={{ fontFamily: 'Tenor Sans, serif' }}>
            Admin Login
          </h1>
          <p className="text-base text-gray-600">
            Access your admin dashboard
          </p>
        </div>

        {/* Error Message */}
        {generalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{generalError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-normal text-gray-700 mb-2"
              style={{ fontFamily: 'Tenor Sans, serif' }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
                setGeneralError('');
              }}
              className={`
                w-full h-12 px-4
                border ${emailError ? 'border-red-500' : 'border-gray-300'}
                focus:border-black focus:outline-none
                text-base
                transition-colors
                ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              `}
              placeholder="admin@example.com"
              disabled={isLoading}
              autoComplete="email"
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-normal text-gray-700 mb-2"
              style={{ fontFamily: 'Tenor Sans, serif' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError('');
                setGeneralError('');
              }}
              className={`
                w-full h-12 px-4
                border ${passwordError ? 'border-red-500' : 'border-gray-300'}
                focus:border-black focus:outline-none
                text-base
                transition-colors
                ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              `}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="current-password"
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full h-12
              bg-black text-white
              text-base font-normal
              transition-opacity
              ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}
            `}
            style={{ fontFamily: 'Tenor Sans, serif' }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Admin access only. Contact support if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}
