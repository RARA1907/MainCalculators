'use client';

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Code2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { usePathname } from "next/navigation"
import { useEmbedDialog } from "@/hooks/useEmbedDialog"

interface EmbedDialogProps {
  title: string;
}

export function EmbedDialog({ title }: EmbedDialogProps) {
  const { toast } = useToast()
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useEmbedDialog();
  
  // Get the current URL
  const baseUrl = 'https://www.maincalculators.com';
  const currentUrl = `${baseUrl}${pathname}`;
  
  // Generate embed code
  const embedCode = `<iframe 
    src="${currentUrl}"
    width="100%"
    height="600px"
    frameborder="0"
    title="${title}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast({
        title: "Embed code copied!",
        description: "The embed code has been copied to your clipboard.",
      });
      setIsOpen(false);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Embed Calculator</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Copy the code below to embed this calculator on your website:
          </p>
          <pre className="p-4 bg-secondary/20 rounded-lg overflow-x-auto text-sm">
            {embedCode}
          </pre>
          <Button onClick={handleCopyCode} className="w-full">
            Copy Embed Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
