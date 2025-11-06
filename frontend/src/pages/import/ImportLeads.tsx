import { useState } from 'react'
import { Download } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { FileUpload } from '@/components/ui/FileUpload'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import * as XLSX from 'xlsx'

interface ImportError {
  row: number
  description: string
}

interface ImportResult {
  total: number
  imported: number
  skipped: number
  errors: ImportError[]
}

type ImportState = 'idle' | 'file-selected' | 'importing' | 'complete'

export default function ImportLeads() {
  const [state, setState] = useState<ImportState>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { user, session } = useAuth()

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setState('file-selected')
    setResult(null)
    setErrorMessage(null)
  }

  const downloadTemplate = () => {
    const data = [
      ['name', 'email', 'phone', 'company', 'status', 'source', 'deal_value', 'notes'],
      ['John Doe', 'john@example.com', '+1234567890', 'Acme Corp', 'new', 'website', 5000, 'Interested in premium plan'],
      ['Jane Smith', 'jane@company.com', '+0987654321', 'Tech Solutions', 'contacted', 'referral', 10000, 'Follow up next week'],
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(data)

    worksheet['!cols'] = [
      { width: 20 },
      { width: 25 },
      { width: 15 },
      { width: 20 },
      { width: 12 },
      { width: 15 },
      { width: 12 },
      { width: 30 },
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads Template')

    XLSX.writeFile(workbook, 'leads-template.xlsx')
  }

  const handleImport = async () => {
    if (!selectedFile || !user || !session) return

    setState('importing')
    setProgress(0)
    setErrorMessage(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    let progressInterval: NodeJS.Timeout | null = null

    try {
      progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/leads/import`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      )

      if (progressInterval) clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        setResult(response.data)
        setState('complete')
      }, 500)
    } catch (error) {
      console.error('Import failed:', error)
      if (progressInterval) clearInterval(progressInterval)
      setState('file-selected')
      setProgress(0)

      if (axios.isAxiosError(error)) {
        if (error.response) {
          setErrorMessage(error.response.data?.error || 'Failed to import leads')
        } else if (error.request) {
          setErrorMessage('Unable to connect to server. Please check if the backend is running.')
        } else {
          setErrorMessage('An error occurred while importing leads')
        }
      } else {
        setErrorMessage('An unexpected error occurred')
      }
    }
  }

  const handleReset = () => {
    setState('idle')
    setSelectedFile(null)
    setProgress(0)
    setResult(null)
    setErrorMessage(null)
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between gap-3 pb-8">
          <h1 className="text-4xl font-black text-gray-900">Import Leads from Spreadsheet</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div>
              <p className="text-base text-gray-700 pb-3 pt-1">
                Follow these steps to import your leads correctly:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Download the template file.</li>
                <li>Fill in your lead data, ensuring all required fields are complete.</li>
                <li>Upload the completed file to begin the import process.</li>
              </ol>
            </div>

            <div className="flex justify-start">
              <Button
                onClick={downloadTemplate}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download template
              </Button>
            </div>

            <div>
              <p className="text-sm text-gray-500">Supported formats: .csv, .xlsx</p>
              <p className="text-sm text-gray-500 pt-1">Max file size: 5MB</p>
              <p className="text-sm text-gray-400 pt-2 italic">Tip: Use the downloaded .xlsx template for best compatibility</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">Error</p>
                <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
              </div>
            )}

            {state === 'idle' && (
              <FileUpload onFileSelect={handleFileSelect} />
            )}

            {state === 'file-selected' && selectedFile && (
              <FileUpload onFileSelect={handleFileSelect} />
            )}

            {state === 'importing' && (
              <ProgressBar progress={progress} label="Importing..." />
            )}

            {state === 'complete' && result && (
              <div className="border border-gray-200 rounded-xl p-6 space-y-6 bg-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Import Complete</h3>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center">
                    <p className="text-3xl font-bold text-blue-600">{result.total}</p>
                    <p className="text-sm font-medium text-blue-700 mt-1">Total</p>
                    <p className="text-xs text-blue-600">Records</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex flex-col items-center">
                    <p className="text-3xl font-bold text-green-600">{result.imported}</p>
                    <p className="text-sm font-medium text-green-700 mt-1">Imported</p>
                    <p className="text-xs text-green-600">Successfully</p>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex flex-col items-center">
                    <p className="text-3xl font-bold text-yellow-600">{result.skipped}</p>
                    <p className="text-sm font-medium text-yellow-700 mt-1">Skipped</p>
                    <p className="text-xs text-yellow-600">Duplicates</p>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex flex-col items-center">
                    <p className="text-3xl font-bold text-red-600">{result.errors.length}</p>
                    <p className="text-sm font-medium text-red-700 mt-1">Errors</p>
                    <p className="text-xs text-red-600">Found</p>
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Error Details</h4>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Row</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {result.errors.map((error, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{error.row}</td>
                              <td className="px-4 py-3 text-gray-600">{error.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {result.imported > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">{result.imported} lead{result.imported !== 1 ? 's' : ''}</span> imported successfully!
                      You can view them in the Pipeline page.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
          {state === 'complete' && (
            <Button onClick={handleReset} variant="secondary">
              Import Another File
            </Button>
          )}
          <Button
            onClick={handleImport}
            disabled={state !== 'file-selected' || !selectedFile || !session}
          >
            Import Leads
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
