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
  const baseUrl = 'https://www.maincalculators.com';
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
      className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 p-2 rounded-full transition-colors"
      onClick={copyToClipboard}
      aria-label="Copy embed code"
    >
      <Code2 className="h-5 w-5" />
    </Button>
  );
}
