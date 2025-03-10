'use client';

import Script from 'next/script';

export function GoogleAdsense() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2588261835139404"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
} 