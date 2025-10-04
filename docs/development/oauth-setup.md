# OAuth Setup Guide - Google & Apple Sign-In

> **Complete guide for configuring social authentication in Eesha Silks mobile app**
> Last Updated: October 2025

---

## Table of Contents

1. [Overview](#overview)
2. [How Social Auth Works](#how-social-auth-works)
3. [Supabase Configuration](#supabase-configuration)
4. [Google OAuth Setup](#google-oauth-setup)
5. [Apple OAuth Setup](#apple-oauth-setup)
6. [Mobile App Configuration](#mobile-app-configuration)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The Eesha Silks app supports **social authentication** using Google and Apple providers. Social auth provides:

- **Single-click sign-in**: No password needed
- **Automatic account creation**: Creates account if user doesn't exist
- **Secure authentication**: OAuth 2.0 standard
- **Better UX**: Faster signup/login flow

### Key Benefits

✅ **One flow for both login & signup** - No separate registration needed
✅ **Auto-populated user data** - Email and name from provider
✅ **No password management** - Provider handles authentication
✅ **Better conversion rates** - Reduces friction in signup

---

## How Social Auth Works

### User Flow

```
User clicks "Sign in with Google/Apple"
         ↓
App redirects to provider (Google/Apple)
         ↓
User approves permissions
         ↓
Provider redirects back to app with token
         ↓
Supabase validates token
         ↓
┌─────────────────────────┐
│ Account exists?         │
├─────────────────────────┤
│ YES → User logged in    │
│ NO  → Account created   │
│       then logged in    │
└─────────────────────────┘
         ↓
User navigates to Home screen
```

### Technical Flow

1. **App** → Calls `supabase.auth.signInWithOAuth({ provider: 'google' })`
2. **Supabase** → Redirects to Google/Apple OAuth consent screen
3. **User** → Approves permissions
4. **Provider** → Redirects to `eeshaapp://auth/callback` with auth code
5. **Supabase** → Exchanges code for access token
6. **App** → Receives session via `onAuthStateChange` listener
7. **Zustand** → Updates auth state, triggers navigation

---

## Supabase Configuration

### Prerequisites

- Supabase project created
- Project URL and anon key configured in `.env`

### Enable Social Providers

1. Go to **Supabase Dashboard**
2. Navigate to **Authentication** → **Providers**
3. Enable **Google** and **Apple** providers

---

## Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**

### Step 2: Configure OAuth Consent Screen

1. Click **Configure Consent Screen**
2. Select **External** user type
3. Fill in required fields:
   - **App name**: Eesha Silks
   - **User support email**: your-email@example.com
   - **Developer contact**: your-email@example.com
4. Add scopes: `email`, `profile`, `openid`
5. Save and continue

### Step 3: Create OAuth Client ID

1. **Application type**: Web application
2. **Name**: Eesha Silks Web Client
3. **Authorized JavaScript origins**:
   ```
   https://<your-project-ref>.supabase.co
   ```
4. **Authorized redirect URIs**:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
5. Click **Create**
6. **Copy Client ID and Client Secret**

### Step 4: Configure in Supabase

1. Go to **Supabase Dashboard** → **Authentication** → **Providers**
2. Click **Google**
3. Enable **Google enabled**
4. Paste **Client ID** and **Client Secret**
5. **Redirect URL** (auto-filled):
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
6. Click **Save**

### Step 5: Create Android OAuth Client (for Expo)

1. Go back to **Google Cloud Console** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. **Application type**: Android
4. **Package name**: `com.eeshasilks.app` (from `app.json`)
5. **SHA-1 certificate fingerprint**:

   For development:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

   For production (EAS Build):
   ```bash
   # Get from EAS Build credentials
   eas credentials
   ```

6. Click **Create**

### Step 6: Create iOS OAuth Client (for Expo)

1. Go back to **Google Cloud Console** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. **Application type**: iOS
4. **Bundle ID**: `com.eeshasilks.app` (from `app.json`)
5. Click **Create**

---

## Apple OAuth Setup

### Step 1: Configure Apple Developer Account

1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+** (new identifier)

### Step 2: Create App ID

1. Select **App IDs**
2. **Description**: Eesha Silks
3. **Bundle ID**: `com.eeshasilks.app`
4. **Capabilities**: Enable **Sign in with Apple**
5. Click **Continue** → **Register**

### Step 3: Create Service ID

1. Click **Identifiers** → **+** (new identifier)
2. Select **Services IDs**
3. **Description**: Eesha Silks Web
4. **Identifier**: `com.eeshasilks.app.web`
5. Click **Continue** → **Register**

### Step 4: Configure Service ID

1. Click on the Service ID you just created
2. Enable **Sign in with Apple**
3. Click **Configure**
4. **Primary App ID**: Select `com.eeshasilks.app`
5. **Domains and Subdomains**:
   ```
   <your-project-ref>.supabase.co
   ```
6. **Return URLs**:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
7. Click **Next** → **Done** → **Continue** → **Save**

### Step 5: Create Private Key

1. Navigate to **Keys** → **+** (new key)
2. **Key Name**: Eesha Silks Sign in with Apple Key
3. Enable **Sign in with Apple**
4. Click **Configure** → Select Primary App ID
5. Click **Save** → **Continue** → **Register**
6. **Download the key** (`.p8` file)
7. **Note the Key ID** (10-character string)

### Step 6: Get Team ID

1. Go to **Membership** in Apple Developer portal
2. **Copy your Team ID** (10-character string)

### Step 7: Configure in Supabase

1. Go to **Supabase Dashboard** → **Authentication** → **Providers**
2. Click **Apple**
3. Enable **Apple enabled**
4. Fill in:
   - **Services ID**: `com.eeshasilks.app.web`
   - **Key ID**: Your Key ID from Step 5
   - **Team ID**: Your Team ID from Step 6
   - **Secret Key**: Paste contents of `.p8` file (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
5. **Redirect URL** (auto-filled):
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
6. Click **Save**

---

## Mobile App Configuration

### App.json Configuration

Add URL schemes for OAuth redirect:

```json
{
  "expo": {
    "scheme": "eeshaapp",
    "ios": {
      "bundleIdentifier": "com.eeshasilks.app",
      "buildNumber": "1.0.0"
    },
    "android": {
      "package": "com.eeshasilks.app",
      "versionCode": 1
    }
  }
}
```

### Deep Linking Setup

The OAuth redirect URL `eeshaapp://auth/callback` is handled by Expo's deep linking system.

**How it works:**
1. User completes OAuth flow in browser
2. Provider redirects to `eeshaapp://auth/callback?access_token=...`
3. Expo detects URL scheme and opens app
4. Supabase SDK extracts token from URL
5. `onAuthStateChange` listener fires with new session

**No additional code needed** - Supabase SDK handles this automatically!

---

## Testing

### Test Google Sign-In

1. Start the app: `npm run mobile`
2. Navigate to Login screen
3. Click **"Continuer avec Google"**
4. Should open browser with Google consent screen
5. Select Google account
6. Approve permissions
7. Should redirect back to app and log in
8. Verify user is on Home screen

### Test Apple Sign-In

1. **iOS only** (Android not supported by Apple)
2. Click **"Continuer avec Apple"**
3. Should open Apple consent screen
4. Select Apple ID
5. Choose whether to share real email or hide email
6. Approve permissions
7. Should redirect back to app and log in

### Test Account Creation

1. Use a NEW email that doesn't exist in your database
2. Click social login button
3. Should create account automatically
4. Verify in Supabase Dashboard → **Authentication** → **Users**
5. User should appear with provider `google` or `apple`

### Test Existing Account Login

1. Use an email that already exists
2. Click social login button
3. Should log in without creating duplicate account
4. Verify session in Zustand devtools (if configured)

---

## Troubleshooting

### Error: "Invalid redirect_uri"

**Cause**: Redirect URI mismatch between Google/Apple and Supabase

**Fix**:
1. Verify Supabase redirect URL: `https://<project-ref>.supabase.co/auth/v1/callback`
2. Ensure exact match in Google Cloud Console / Apple Developer Portal
3. No trailing slashes
4. HTTPS required

### Error: "App not found"

**Cause**: Deep link URL scheme not configured

**Fix**:
1. Verify `scheme: "eeshaapp"` in `app.json`
2. Rebuild app: `npx expo prebuild --clean`
3. Reinstall app on device

### Error: "Provider not enabled"

**Cause**: OAuth provider not enabled in Supabase

**Fix**:
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Enable Google and/or Apple
3. Save configuration

### OAuth Flow Opens but Doesn't Redirect Back

**Cause**: Callback URL not handled properly

**Fix**:
1. Ensure `detectSessionInUrl: false` in Supabase client (already configured)
2. Verify `onAuthStateChange` listener is set up in `authStore.initialize()`
3. Check Expo logs for deep link errors

### "Sign in with Apple" Fails on Android

**Expected**: Apple Sign-In is iOS only

**Workaround**: Hide Apple button on Android:
```typescript
import { Platform } from 'react-native';

{Platform.OS === 'ios' && (
  <EeshaSocialButton provider="apple" onPress={handleAppleSignIn} />
)}
```

### User Created but Not Logged In

**Cause**: `onAuthStateChange` listener not firing

**Fix**:
1. Verify `authStore.initialize()` is called in `App.tsx`
2. Check console logs for auth state changes
3. Ensure Zustand store is properly connected

---

## Security Considerations

### Client ID & Secret

- **Never commit** Google Client Secret to version control
- Store in `.env.local` for admin dashboard
- Mobile app only uses **Supabase URL and anon key**

### Redirect URL Validation

- Supabase validates redirect URLs
- Only configured URLs can receive auth tokens
- Prevents OAuth hijacking attacks

### Token Storage

- Access tokens stored in Expo SecureStore (encrypted)
- Session managed by Supabase SDK
- Auto-refresh handled by SDK

---

## Next Steps

1. ✅ Configure Google OAuth in Google Cloud Console
2. ✅ Configure Apple OAuth in Apple Developer Portal
3. ✅ Enable providers in Supabase Dashboard
4. ✅ Test social login on iOS and Android
5. ✅ Monitor user signups in Supabase Dashboard
6. ⏭️ Add profile data enrichment (optional)
7. ⏭️ Implement "Link Account" feature (optional)

---

## Resources

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Expo Deep Linking](https://docs.expo.dev/guides/linking/)

---

## Questions?

For issues or questions:
1. Check Supabase auth logs: Dashboard → **Authentication** → **Logs**
2. Check mobile app logs: `npx expo start` console
3. Review this documentation's troubleshooting section
4. Check Supabase Discord or GitHub issues
