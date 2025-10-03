'use client';

import React, { useState } from 'react';
import { signInAdminAction } from './actions';
import { validateEmail, validatePassword, AUTH_ERRORS } from '@eesha/shared';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const result = await signInAdminAction(email, password);

      if (result && result.success) {
        // Redirect to dashboard on success
        window.location.href = '/admin/dashboard';
      } else if (result && !result.success) {
        setGeneralError(result.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('[LoginPage] Error:', error);
      setGeneralError(AUTH_ERRORS.UNKNOWN_ERROR);
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
                focus:border-black focus:outline-none focus:ring-1 focus:ring-black
                text-base text-gray-900
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
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                  setGeneralError('');
                }}
                className={`
                  w-full h-12 px-4 pr-12
                  border ${passwordError ? 'border-red-500' : 'border-gray-300'}
                  focus:border-black focus:outline-none focus:ring-1 focus:ring-black
                  text-base text-gray-900
                  transition-colors
                  ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                `}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? (
                  // Eye slash icon (hide password)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  // Eye icon (show password)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
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
