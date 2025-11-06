import { Router } from 'express'
import multer from 'multer'
import { importLeadsFromFile } from '../controllers/importController.js'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls']
    const extension = '.' + file.originalname.split('.').pop()?.toLowerCase()

    if (allowedTypes.includes(extension)) {
      cb(null, true)
    } else {
      cb(new Error('Only .csv and .xlsx files are allowed'))
    }
  },
})

router.post('/import', upload.single('file'), importLeadsFromFile)

export default router
