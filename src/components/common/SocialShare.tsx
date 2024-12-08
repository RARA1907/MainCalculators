'use client';

import { Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
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
      >
        <Facebook className="w-5 h-5" />
      </a>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
      >
        <Twitter className="w-5 h-5" />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
      >
        <Linkedin className="w-5 h-5" />
      </a>
      <button
        onClick={copyToClipboard}
        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <LinkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
