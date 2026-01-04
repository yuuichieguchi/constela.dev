import type { NextConfig } from "next";

// 共通セキュリティヘッダー
const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

// Playground用CSP（unsafe-eval許可）
const playgroundCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "img-src 'self' blob: data:",
  "font-src 'self' https://cdn.jsdelivr.net data:",
  "connect-src 'self' https://cdn.jsdelivr.net https://jsonplaceholder.typicode.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

// 通常ページ用CSP
const defaultCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      // その他全ページ用（通常CSP）- 先に定義
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: defaultCsp,
          },
        ],
      },
      // Playgroundページ用（CSP緩和）- 後から上書き
      {
        source: "/playground",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: playgroundCsp,
          },
        ],
      },
      // Playgroundサブパス用（CSP緩和）
      {
        source: "/playground/:path+",
        headers: [
          ...securityHeaders,
          {
            key: "Content-Security-Policy",
            value: playgroundCsp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
