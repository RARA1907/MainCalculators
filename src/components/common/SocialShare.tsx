'use client';

import { Share2, Link2, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useEmbedDialog } from '@/hooks/useEmbedDialog';

interface SocialShareProps {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
  const { toast } = useToast();
  const { setIsOpen } = useEmbedDialog();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="bg-white hover:bg-white border-gray-200 hover:border-gray-300"
        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank')}
      >
        <Share2 className="h-5 w-5 text-gray-700 hover:text-black" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="bg-white hover:bg-white border-gray-200 hover:border-gray-300"
        onClick={handleCopyLink}
      >
        <Link2 className="h-5 w-5 text-gray-700 hover:text-black" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="bg-white hover:bg-white border-gray-200 hover:border-gray-300"
        onClick={() => setIsOpen(true)}
      >
        <Code2 className="h-5 w-5 text-gray-700 hover:text-black" />
      </Button>
    </div>
  );
}
