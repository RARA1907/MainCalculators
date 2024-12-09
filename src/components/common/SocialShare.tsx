'use client';

import { Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';

interface SocialShareProps {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!mounted) return;
    
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The calculator link has been copied to your clipboard.",
        duration: 3000,
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!mounted) {
    return null;
  }

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
        className="text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-5 h-5" />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </a>
      <Button
        variant="ghost"
        size="icon"
        onClick={copyToClipboard}
        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        aria-label="Copy link"
      >
        <LinkIcon className="w-5 h-5" />
      </Button>
    </div>
  );
}
