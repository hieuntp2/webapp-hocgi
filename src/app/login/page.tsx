"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { Header } from "@/components/layout/Header";
import { useApp } from "@/contexts/AppContext";
import { extractUserFromAccessToken } from "@/hooks/useAuth";

const SSO_URL =
  process.env.NEXT_PUBLIC_SSO_URL || "https://hocgi.vn/account/sso";
const SSO_RETURN_URL = `${process.env.NEXT_PUBLIC_SSO_RETURN_URL}/login`;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, state } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsedRedirectUrl, setParsedRedirectUrl] = useState<string | null>(null);
  
  // Fallback to searchParams hook, but will be overridden by parsed value
  const redirectUrl = parsedRedirectUrl ?? searchParams.get('redirectUrl');

  // Redirect to dashboard or redirectUrl if already authenticated
  useEffect(() => {
    if (!state.isLoading && state.isAuthenticated) {
      const targetUrl = redirectUrl || '/dashboard';
      router.replace(targetUrl);
    }
  }, [state.isLoading, state.isAuthenticated, router, redirectUrl]);

  // Parse redirectUrl from URL (handle edge case with multiple "?" characters)
  useEffect(() => {
    const normalizeSearchString = (search: string) => {
      if (!search || !search.startsWith('?')) return search;
      
      // Remove first "?" and split by remaining "?"
      const withoutFirstQuestion = search.slice(1);
      const parts = withoutFirstQuestion.split('?');
      
      // Join back with "&" instead of "?"
      return parts.length > 1 ? '?' + parts.join('&') : search;
    };

    const normalizedSearch = normalizeSearchString(window.location.search);
    const params = new URLSearchParams(normalizedSearch);
    const parsed = params.get('redirectUrl');
    
    if (parsed) {
      setParsedRedirectUrl(parsed);
    }
  }, []);

  useEffect(() => {
    const readParams = (raw: string) => {
      const params = new URLSearchParams(raw);
      const token =
        params.get("token") ||
        params.get("access_token") ||
        params.get("accessToken") ||
        params.get("jwt") ||
        params.get("id_token") ||
        params.get("idToken");
      const email =
        params.get("email") || params.get("user") || params.get("userName");
      const fullName = params.get("fullName") || params.get("name");
      const userId = params.get("userId") || params.get("id");
      return { token, email, fullName, userId };
    };

    // Normalize URL search string - handle edge case with multiple "?" characters
    // Example: ?redirectUrl=%2Fbuoc-hai%3FroomId%3D3?accessToken=xxx
    // Should be: ?redirectUrl=%2Fbuoc-hai%3FroomId%3D3&accessToken=xxx
    const normalizeSearchString = (search: string) => {
      if (!search || !search.startsWith('?')) return search;
      
      // Remove first "?" and split by remaining "?"
      const withoutFirstQuestion = search.slice(1);
      const parts = withoutFirstQuestion.split('?');
      
      // Join back with "&" instead of "?"
      return parts.length > 1 ? '?' + parts.join('&') : search;
    };

    const normalizedSearch = normalizeSearchString(window.location.search);
    const searchParams = readParams(normalizedSearch);
    
    // Also parse and store redirectUrl for later use
    const urlParams = new URLSearchParams(normalizedSearch);
    const parsedRedirect = urlParams.get('redirectUrl');
    if (parsedRedirect && !parsedRedirectUrl) {
      setParsedRedirectUrl(parsedRedirect);
    }
    
    const hashParams = window.location.hash.startsWith("#")
      ? readParams(window.location.hash.slice(1))
      : { token: null, email: null, fullName: null, userId: null };

    const token = searchParams.token || hashParams.token;
    const email = searchParams.email || hashParams.email || "";
    const fullName = searchParams.fullName || hashParams.fullName || "";
    const userId = searchParams.userId || hashParams.userId || "";

    if (!token && !email && !fullName && !userId) return;

    const tokenUser = extractUserFromAccessToken(token);
    const mergedUser = {
      id: tokenUser?.id || userId || email || "sso-user",
      email: tokenUser?.email || email || "",
      name: tokenUser?.name || tokenUser?.fullName || fullName || undefined,
      fullName: tokenUser?.fullName || fullName || tokenUser?.name || undefined,
    };

    login(mergedUser, token || undefined);

    // Redirect to the original URL or dashboard
    const targetUrl = parsedRedirect || "/dashboard";
    router.replace(targetUrl);
  }, [login, router, parsedRedirectUrl]);

  const handleSsoLogin = () => {
    if (!SSO_URL) {
      setError("Thiếu cấu hình SSO");
      return;
    }

    setIsLoading(true);
    setError("");

    // Build return URL with redirectUrl if present
    let returnUrl = SSO_RETURN_URL || window.location.origin;
    if (redirectUrl) {
      returnUrl = `${returnUrl}?redirectUrl=${encodeURIComponent(redirectUrl)}`;
    }
    
    const url = `${SSO_URL}?returnUrl=${encodeURIComponent(returnUrl)}`;
    window.location.href = url;
  };

  // Show nothing while checking authentication or if already authenticated
  if (state.isLoading || state.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-primary">
      <Header title="Đăng nhập" onBack={() => router.push("/")} />

      <div className="flex-1 px-6 pt-6">
        {/* Header with warm gradient icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent-dark flex items-center justify-center shadow-warm">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-neutral-900 font-heading">
            Chào mừng trở lại!
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Đăng nhập để tiếp tục</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-neutral-500 text-center">
            Đăng nhập được thực hiện qua hệ thống SSO của hocgi.vn.
          </p>

          {error && (
            <div className="p-3 bg-error-light rounded-lg border border-error/20">
              <p className="text-sm text-error text-center">{error}</p>
            </div>
          )}

          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full uppercase tracking-wider"
            isLoading={isLoading}
            onClick={handleSsoLogin}
          >
            Đăng nhập
          </Button>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 text-center safe-area-bottom">
        <p className="text-sm text-neutral-500">
          Chưa có tài khoản?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-primary font-semibold hover:text-primary-dark hover:underline transition-colors"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent-dark flex items-center justify-center shadow-warm animate-pulse">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <p className="text-sm text-neutral-500">Đang tải...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
