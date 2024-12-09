'use client';

import { Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const websiteName = "MainCalculators.com";
  const shareText = `Check out this ${title} on ${websiteName}`;
  const encodedShareText = encodeURIComponent(shareText);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedShareText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedShareText}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex space-x-4 items-center">
      <span className="text-sm text-gray-600 dark:text-gray-400">Share:</span>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-5 h-5" />
      </a>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-5 h-5" />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </a>
      <button
        onClick={copyToClipboard}
        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        aria-label="Copy link to clipboard"
      >
        <LinkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
