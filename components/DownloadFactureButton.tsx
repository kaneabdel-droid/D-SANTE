'use client'

import { useState } from 'react'
import { Receipt, Loader2 } from 'lucide-react'
import { downloadFactureSantePdf, FactureSanteData } from '@/lib/pdf-generator'

interface DownloadFactureButtonProps {
  data: FactureSanteData
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
}

export function DownloadFactureButton({ data, variant = 'outline', size = 'sm' }: DownloadFactureButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    try {
      setLoading(true)
      await downloadFactureSantePdf(data)
    } catch (err) {
      console.error('Erreur génération facture PDF:', err)
      alert('Erreur lors de la génération de la facture PDF')
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
      title="Télécharger la facture de soins / reçu de paiement en PDF"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Receipt className="w-3.5 h-3.5 text-teal-600" />
      )}
      <span>{loading ? 'PDF...' : 'Facture PDF'}</span>
    </button>
  )
}

