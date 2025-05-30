const multer = require('multer')
const path = require('path')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blogFolder',
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
})

const fileFilter = (req, file, cb) => {
    const allowdTypes = ['image/jpeg', 'image/png'];
    if(allowdTypes.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(new Error('Only images are allowed'), false)
    }
}

const uploads = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { limits: 10 * 1024 * 1024 }
})

module.exports = uploads