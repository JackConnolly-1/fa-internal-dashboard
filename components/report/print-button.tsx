'use client'

import { Download } from 'lucide-react'

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="r-noprint fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-navy-800"
    >
      <Download className="h-4 w-4" /> Download PDF
    </button>
  )
}
