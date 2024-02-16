const { Router } = require('express')
const { uploadFile } = require('../controllers/file.controller')

const router = Router()

//api: url/file/__

//File Upload
router.post('/upload', uploadFile)

module.exports = router
