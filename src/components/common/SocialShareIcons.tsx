'use client'

import { Twitter, Facebook, Linkedin, Link2 } from 'lucide-react'
import { toast } from 'sonner'

interface SocialShareIconsProps {
  title?: string
  results?: string
}

export function SocialShareIcons({ title = '', results = '' }: SocialShareIconsProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `${title}${results ? `: ${results}` : ''}`
  
  const handleShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(shareUrl)
    
    let shareLink = ''
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'copy':
        navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied to clipboard!')
        return
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 rounded-full bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-colors"
        title="Share on Twitter"
      >
        <Twitter size={18} />
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="p-2 rounded-full bg-[#4267B2] text-white hover:bg-[#365899] transition-colors"
        title="Share on Facebook"
      >
        <Facebook size={18} />
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="p-2 rounded-full bg-[#0077b5] text-white hover:bg-[#006399] transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </button>
      <button
        onClick={() => handleShare('copy')}
        className="p-2 rounded-full bg-gray-200 "
        title="Copy Link"
      >
        <Link2 size={18} />
      </button>
    </div>
  )
}
