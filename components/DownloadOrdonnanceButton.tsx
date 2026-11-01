'use client'

import { useState } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import { downloadOrdonnancePdf, OrdonnanceData } from '@/lib/pdf-generator'

interface DownloadOrdonnanceButtonProps {
  data: OrdonnanceData
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
}

export function DownloadOrdonnanceButton({ data, variant = 'outline', size = 'sm' }: DownloadOrdonnanceButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setLoading(true)
      await downloadOrdonnancePdf(data)
    } catch (err) {
      console.error('Erreur génération ordonnance PDF:', err)
      alert("Erreur lors de la génération de l'ordonnance PDF")
    } finally {
      setLoading(false)
    }
  }

  const baseStyle = "inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
  const sizeStyle = size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm'
  const variantStyle =
    variant === 'primary'
      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
      : variant === 'ghost'
      ? 'text-foreground-muted hover:text-foreground hover:bg-surface-hover'
      : 'border border-surface-border text-foreground hover:bg-surface-hover'

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`${baseStyle} ${sizeStyle} ${variantStyle}`}
      title="Télécharger l'ordonnance médicale officielle en PDF"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <FileText className="w-3.5 h-3.5 text-emerald-600" />
      )}
      <span>{loading ? 'Génération...' : 'Ordonnance PDF'}</span>
    </button>
  )
}

