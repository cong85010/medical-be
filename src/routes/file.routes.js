const { Router } = require('express')
const { uploadFile, uploadFiles } = require('../controllers/file.controller')

const router = Router()

//api: url/file/__

//File Upload
router.post('/upload', uploadFile)
router.post('/uploads', uploadFiles)

module.exports = router
