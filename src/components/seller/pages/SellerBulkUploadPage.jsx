import { useState } from 'react'
import { FileSpreadsheet, Download, UploadCloud, FileCheck2, CheckCircle2 } from 'lucide-react'
import { CATEGORIES } from '../../../data'

const CSV_HEADERS = ['Product Name', 'Price', 'Qty', 'Brand', 'Color', 'Material', 'Description']

export default function SellerBulkUploadPage({ onToast }) {
  const [mainCat, setMainCat] = useState('')
  const [subCat, setSubCat] = useState('')
  const [fileName, setFileName] = useState('')
  const [uploaded, setUploaded] = useState(false)

  const category = CATEGORIES.find((c) => c.id === mainCat)
  const subcategories = category?.subcategories || []

  const downloadTemplate = () => {
    if (!mainCat || !subCat) {
      onToast?.('Select both Main Category and Category first.')
      return
    }
    const subLabel = subcategories.find((s) => s.slug === subCat)?.name || subCat
    const csv = [CSV_HEADERS.join(','), `"Example ${subLabel} Product",999,100,"Brand Name",White,Plastic,"Sample description"`].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${category.name}-${subLabel}-template.csv`.replace(/\s+/g, '_')
    a.click()
    URL.revokeObjectURL(url)
    onToast?.('Template downloaded!')
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setUploaded(false)
  }

  const submitUpload = () => {
    if (!fileName) { onToast?.('Choose a CSV file first.'); return }
    setUploaded(true)
    onToast?.(`"${fileName}" uploaded successfully — demo only.`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900">Bulk Upload</h1>
        <p className="text-sm text-slate-500">Add many products at once using a CSV file</p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-3">
        {[
          { step: 1, label: 'Download Template', done: mainCat && subCat },
          { step: 2, label: 'Fill CSV', done: false },
          { step: 3, label: 'Upload', done: uploaded },
        ].map((s, i) => (
          <div key={s.step} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold transition-colors ${
                s.done ? 'bg-accent-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {s.done ? <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} /> : s.step}
              </span>
              <span className={`text-xs font-semibold ${s.done ? 'text-accent-600' : 'text-slate-500'}`}>{s.label}</span>
            </div>
            {i < 2 && <div className="mx-2 h-px w-8 bg-slate-200" />}
          </div>
        ))}
      </div>

      {/* Step 1 — download template */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        <div className="flex items-center gap-3 border-l-4 border-aqua-500 bg-aqua-50/50 px-5 py-4">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-aqua-100 text-aqua-600">
            <FileSpreadsheet className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-navy-800">Step 1: Download CSV Template</h2>
            <p className="text-xs text-slate-500">Select categories to download the matching template</p>
          </div>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Main Category *</span>
            <select
              value={mainCat}
              onChange={(e) => { setMainCat(e.target.value); setSubCat('') }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm transition-colors focus:border-aqua-400 focus:bg-white"
            >
              <option value="">Select Maincategory</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-slate-500">Category *</span>
            <select
              value={subCat}
              onChange={(e) => setSubCat(e.target.value)}
              disabled={!mainCat}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm transition-colors focus:border-aqua-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Select Category</option>
              {subcategories.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
          </label>
        </div>
        <div className="px-5 pb-5">
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-2 rounded-xl bg-aqua-500 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-aqua-600 hover:shadow-lift"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.5} /> Download Template
          </button>
        </div>
      </div>

      {/* Step 2 — upload filled CSV */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        <div className="flex items-center gap-3 border-l-4 border-navy-500 bg-navy-50/50 px-5 py-4">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-navy-100 text-navy-600">
            <UploadCloud className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-navy-800">Step 2: Upload Filled CSV</h2>
            <p className="text-xs text-slate-500">Upload your completed CSV to add products</p>
          </div>
        </div>
        <div className="p-5">
          <label className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-4 py-12 text-center transition-all ${
            uploaded
              ? 'border-accent-300 bg-accent-50/50'
              : fileName
                ? 'border-aqua-300 bg-aqua-50/50'
                : 'border-slate-300 hover:border-aqua-400 hover:bg-aqua-50/30'
          }`}>
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
              uploaded ? 'bg-accent-100 text-accent-600' : fileName ? 'bg-aqua-100 text-aqua-600' : 'bg-slate-100 text-slate-400'
            }`}>
              {uploaded ? <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} /> : fileName ? <FileCheck2 className="h-5 w-5" strokeWidth={1.5} /> : <UploadCloud className="h-5 w-5" strokeWidth={1.5} />}
            </span>
            <div>
              <span className="block text-sm font-semibold text-navy-800">
                {uploaded ? 'Upload Complete!' : fileName || 'Choose CSV File'}
              </span>
              <span className="block text-xs text-slate-400">
                {uploaded ? 'Your products are being processed' : fileName ? 'Click to choose a different file' : 'Drag & drop or click to browse'}
              </span>
            </div>
            <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
          </label>
          <button
            onClick={submitUpload}
            disabled={uploaded}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-navy-700 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploaded ? <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} /> : <UploadCloud className="h-3.5 w-3.5" strokeWidth={1.5} />}
            {uploaded ? 'Uploaded' : 'Upload Products'}
          </button>
        </div>
      </div>
    </div>
  )
}
