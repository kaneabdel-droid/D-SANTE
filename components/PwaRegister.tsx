'use client'

import { useEffect } from 'react'

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('D-Santé ServiceWorker enregistré avec succès:', reg.scope))
        .catch((err) => console.warn('D-Santé ServiceWorker échec enregistrement:', err))
    }
  }, [])

  return null
}

