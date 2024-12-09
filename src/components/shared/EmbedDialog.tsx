'use client';

import { Button } from "@/components/ui/button"
import { Code2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { usePathname } from "next/navigation"

interface EmbedDialogProps {
  title: string;
}

export function EmbedDialog({ title }: EmbedDialogProps) {
  const { toast } = useToast()
  const pathname = usePathname();
  
  // Get the current URL
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_BASE_URL || 'https://www.maincalculators.com';
  const currentUrl = `${baseUrl}${pathname}`;
  
  // Generate embed code
  const embedCode = `<iframe 
  src="${currentUrl}"
  width="100%" 
  height="600px" 
  frameBorder="0" 
  allowTransparency="true"
  style="border: 1px solid #ddd; border-radius: 8px;"
></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      toast({
        title: "Embed code copied!",
        description: "You can now paste the embed code into your website to display this calculator.",
        duration: 3000,
      });
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 bg-white hover:bg-white hover:opacity-80"
      onClick={copyToClipboard}
      title="Copy embed code"
    >
      <Code2 className="h-5 w-5 text-black" />
    </Button>
  );
}
