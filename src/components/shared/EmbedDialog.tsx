'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Code2, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { usePathname } from "next/navigation"

interface EmbedDialogProps {
  title: string;
}

export default function EmbedDialog({ title }: EmbedDialogProps) {
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
        variant: "default",
        title: "Copied to clipboard",
        description: "The embed code has been copied to your clipboard",
        duration: 3000,
      });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Code2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Embed {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
              {embedCode}
            </pre>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Copy and paste this code into your website to embed this calculator.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
