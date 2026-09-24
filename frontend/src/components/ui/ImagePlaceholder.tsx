import { Cookie } from 'lucide-react'

type ImagePlaceholderProps = {
  src?: string | null
  alt: string
  className?: string
  label?: string
}

export default function ImagePlaceholder({
  src,
  alt,
  className = '',
  label = 'Photo coming soon',
}: ImagePlaceholderProps) {
  if (src) {
    return <img src={src} alt={alt} className={`object-cover ${className}`} />
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex flex-col items-center justify-center gap-2 bg-linear-to-br from-cream-200 via-gold-400/40 to-gold-500/60 text-maroon-800/60 ${className}`}
    >
      <Cookie size={48} strokeWidth={1.25} />
      <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
    </div>
  )
}