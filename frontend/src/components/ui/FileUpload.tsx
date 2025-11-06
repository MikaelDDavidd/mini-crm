import { FC, useRef, useState, DragEvent, ChangeEvent } from 'react'
import { CloudUpload, X, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  disabled?: boolean
}

export const FileUpload: FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.csv,.xlsx',
  maxSize = 5 * 1024 * 1024,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    setError(null)

    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
      return false
    }

    const acceptedTypes = accept.split(',').map(t => t.trim())
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!acceptedTypes.includes(fileExtension)) {
      setError(`Only ${accept} files are accepted`)
      return false
    }

    return true
  }

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (selectedFile && !error) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          disabled={disabled}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors',
          isDragging && !disabled && 'border-primary bg-primary/5',
          !isDragging && !disabled && 'border-gray-300 hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed border-gray-200'
        )}
      >
        <CloudUpload className={cn('h-12 w-12', isDragging ? 'text-primary' : 'text-primary')} />
        <p className="mt-4 font-semibold text-gray-900">Drag & drop your file here</p>
        <p className="text-sm text-gray-500">
          or <span className="font-semibold text-primary">click to browse</span>
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
