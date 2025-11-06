import { Request, Response } from 'express'
import { parseFile, importLeads } from '../services/importService.js'

export const importLeadsFromFile = async (req: Request, res: Response) => {
  try {
    console.log('Import request received')

    if (!req.file) {
      console.log('No file uploaded')
      return res.status(400).json({ error: 'No file uploaded' })
    }

    console.log('File received:', req.file.originalname, req.file.size, 'bytes')

    const authToken = req.headers.authorization?.replace('Bearer ', '')

    if (!authToken) {
      console.log('No auth token')
      return res.status(401).json({ error: 'Unauthorized' })
    }

    console.log('Auth token received, length:', authToken.length)
    console.log('Parsing file...')

    const records = parseFile(req.file.buffer, req.file.originalname)

    console.log('Records parsed:', records.length)
    console.log('First record:', JSON.stringify(records[0]))

    if (records.length === 0) {
      return res.status(400).json({ error: 'File is empty or invalid' })
    }

    console.log('Starting import...')
    const result = await importLeads(records, authToken)

    console.log('Import complete:', result)
    res.json(result)
  } catch (error) {
    console.error('Import error:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to import leads',
    })
  }
}
