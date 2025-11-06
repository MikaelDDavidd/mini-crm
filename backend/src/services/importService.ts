import { parse } from 'csv-parse/sync'
import * as XLSX from 'xlsx'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'

const getSupabaseClient = (authToken?: string): SupabaseClient => {
  const supabaseUrl = process.env.SUPABASE_URL
  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is not configured')
  }

  const supabaseKey = process.env.SUPABASE_SERVICE_KEY && process.env.SUPABASE_SERVICE_KEY !== 'your_service_key_here'
    ? process.env.SUPABASE_SERVICE_KEY
    : process.env.SUPABASE_ANON_KEY

  if (!supabaseKey) {
    throw new Error('SUPABASE_ANON_KEY is not configured')
  }

  if (authToken) {
    return createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    })
  }

  return createClient(supabaseUrl, supabaseKey)
}

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.union([z.string(), z.number()]).optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost']).default('new'),
  source: z.string().optional().or(z.literal('')),
  deal_value: z.union([z.string(), z.number()]).optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

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

export const parseFile = (buffer: Buffer, filename: string): Record<string, string>[] => {
  const extension = filename.split('.').pop()?.toLowerCase()

  if (extension === 'csv') {
    return parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
  }

  if (extension === 'xlsx' || extension === 'xls') {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    return XLSX.utils.sheet_to_json(sheet, { defval: '' })
  }

  throw new Error('Unsupported file format')
}

export const importLeads = async (
  records: Record<string, string>[],
  authToken: string
): Promise<ImportResult> => {
  const supabase = getSupabaseClient(authToken)

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized: Invalid token')
  }

  const userId = user.id
  const errors: ImportError[] = []
  const validLeads: any[] = []
  let skipped = 0

  for (let i = 0; i < records.length; i++) {
    const rowNumber = i + 2
    const record = records[i]

    try {
      console.log(`Validating row ${rowNumber}:`, record)
      const validated = leadSchema.parse(record)
      console.log(`Row ${rowNumber} validated successfully`)

      const leadData = {
        user_id: userId,
        name: validated.name,
        email: validated.email || null,
        phone: validated.phone ? String(validated.phone) : null,
        company: validated.company || null,
        status: validated.status,
        source: validated.source ? validated.source.toLowerCase() : null,
        deal_value: validated.deal_value
          ? typeof validated.deal_value === 'number'
            ? validated.deal_value
            : parseFloat(validated.deal_value)
          : null,
        notes: validated.notes || null,
        is_active: true,
        priority: 'normal',
        tags: [],
      }

      if (validated.email) {
        const { data: existing } = await supabase
          .from('leads')
          .select('id')
          .eq('email', validated.email)
          .eq('user_id', userId)
          .single()

        if (existing) {
          errors.push({
            row: rowNumber,
            description: 'Duplicate lead detected',
          })
          skipped++
          continue
        }
      }

      validLeads.push(leadData)
    } catch (error) {
      console.log(`Row ${rowNumber} validation failed:`, error)
      if (error instanceof z.ZodError) {
        const firstError = error.issues?.[0]
        console.log('Zod error details:', error.issues)
        errors.push({
          row: rowNumber,
          description: firstError?.message || 'Validation error',
        })
      } else {
        errors.push({
          row: rowNumber,
          description: error instanceof Error ? error.message : 'Invalid data format',
        })
      }
    }
  }

  let imported = 0

  if (validLeads.length > 0) {
    const { data, error } = await supabase
      .from('leads')
      .insert(validLeads)
      .select()

    if (error) {
      throw new Error(`Failed to import leads: ${error.message}`)
    }

    imported = data?.length || 0
  }

  return {
    total: records.length,
    imported,
    skipped,
    errors,
  }
}
