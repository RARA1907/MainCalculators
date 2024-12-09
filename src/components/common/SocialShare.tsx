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
  const websiteName = "MainCalculators";
  const shareText = `Check out this ${title} on MainCalculators`;
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
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        onClick={() => window.open(shareLinks.facebook, '_blank')}
        aria-label="Share on Facebook"
      >
        <Facebook className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        onClick={() => window.open(shareLinks.twitter, '_blank')}
        aria-label="Share on Twitter"
      >
        <Twitter className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        onClick={() => window.open(shareLinks.linkedin, '_blank')}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        onClick={copyToClipboard}
        aria-label="Copy link"
      >
        <LinkIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
