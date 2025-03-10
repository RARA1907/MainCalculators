'use client';

import { useEffect, useRef } from 'react';

export function AdSenseLoader() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Create a hidden iframe to load the AdSense script
    if (iframeRef.current) {
      iframeRef.current.style.display = 'none';
    }
  }, []);

  return (
    <iframe 
      ref={iframeRef}
      src="/adsense.html"
      title="AdSense Loader"
      width="0"
      height="0"
      style={{ display: 'none' }}
    />
  );
} 