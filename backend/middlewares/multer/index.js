const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const internalStorage = multer.diskStorage({
    destination: (res, file, cb) => {
        cb(null, 'upload')
    },
    filename: (req, file, cb)=>{
        const unixSuffix =  `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const fileExstension = filename.originalname.split('-').pop()
        cb(null, `${file.fieldname}-${unixSuffix}.${fileExstension}`)
    }
})

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'Epicode-M6W1D1',
        format: async(request, file) => 'jpg',
        public_id: (req, file) => file.name
    }
})

const upload = multer({storage: internalStorage})
const cloud = multer({storage:cloudStorage})

module.exports = {
    upload,
    cloud
}