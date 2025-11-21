# Authentication Setup Guide

Your app is now fully integrated with **Lovable Cloud** authentication! Follow these steps to complete the setup:

## Step 1: Run the Database Setup SQL

1. Open your project and click on the **Cloud** tab
2. Navigate to **Database → SQL Editor**
3. Copy the contents of `setup_profiles_and_auth.sql`
4. Paste it into the SQL Editor and click **Run**

This will create:
- ✅ User profiles table
- ✅ User roles system (admin, technician, user)
- ✅ Automatic profile creation on signup
- ✅ Proper Row-Level Security (RLS) policies
- ✅ Company integration for scheduling features

## Step 2: Configure Email Settings (Optional but Recommended)

For faster testing, you can disable email confirmation:

1. Go to **Cloud → Authentication → Settings**
2. Find "Confirm email" setting
3. **Disable** it for development/testing
4. Re-enable it before going to production

## Step 3: Test Your Authentication

### Sign Up Flow:
1. Go to `/auth` in your app
2. Click "Sign Up" tab
3. Fill in:
   - Full Name
   - Company Name (creates your company automatically!)
   - Email
   - Password (min 6 characters)
4. Click "Create Account"
5. If email confirmation is enabled, check your email and verify
6. Return to the app and sign in

### Sign In Flow:
1. Go to `/auth`
2. Enter your email and password
3. Click "Sign In"
4. You'll be automatically redirected to the dashboard

## What's Already Working:

✅ **Email/Password Authentication**
- Sign up with automatic company creation
- Sign in with session persistence
- Protected routes (auth required)
- Automatic redirect when logged in

✅ **User Profiles**
- Automatic profile creation on signup
- Profile data accessible via `useAuth()` hook
- Linked to companies for multi-tenant features

✅ **User Roles System**
- Every user gets a default 'user' role
- Ready for admin/technician role assignments
- Secure role checking with `has_role()` function

✅ **Session Management**
- Persistent sessions (survives page refresh)
- Automatic token refresh
- Secure logout functionality

✅ **Google Sign-In Ready**
- Button already in place
- Just needs Google OAuth configuration in Cloud settings

## Security Features:

🔒 **Row-Level Security (RLS)**
- Users can only see their own profile
- Users can only see data from their company
- Secure role-based access control

🔒 **Proper Authentication Flow**
- Email redirect URLs configured
- Session tokens managed securely
- CSRF protection enabled

## Using Authentication in Your Code:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, userProfile, signOut } = useAuth();
  
  return (
    <div>
      <p>Welcome, {userProfile?.full_name}!</p>
      <p>Email: {user?.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Troubleshooting:

**Problem: "Invalid login credentials"**
- Solution: Make sure you've verified your email (if confirmation enabled)

**Problem: "Email not confirmed"**
- Solution: Check your email for verification link
- Or disable email confirmation in Cloud settings for testing

**Problem: Can't see database tables**
- Solution: Make sure you ran the SQL script in Cloud → Database → SQL Editor

**Problem: Company not created**
- Solution: Check the browser console for errors
- The setup_profiles_and_auth.sql includes better error handling

## Next Steps:

1. ✅ Run the SQL setup script
2. ✅ Create your first account
3. ✅ Sign in and explore the dashboard
4. 🎯 Add more users to your company
5. 🎯 Configure Google OAuth (optional)
6. 🎯 Customize user roles and permissions

## Need Help?

- Check the Cloud tab for database status
- View logs in the browser console
- Check the Authentication section in Cloud settings

---

**Your app is fully integrated with Lovable Cloud!** 🎉

All authentication, database, and backend features are powered by Lovable Cloud with zero external dependencies.
