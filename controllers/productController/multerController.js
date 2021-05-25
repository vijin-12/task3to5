const multer = require('multer');
const AppError = require('../../utils/appError');

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = `public/product/images`
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        let filename = file.originalname
        let extinsion = filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename
        cb(null, `image-${Date.now()}.${extinsion}`)
    }
})

const multerValidator = (req, file, cb) => {
    if(file.mimetype.startsWith('video')) return cb(new AppError('Not an image please uplod only images', 400))
    return cb(null, true)
}

const uploadReport = multer({
    storage: imageStorage,
    fileFilter: multerValidator
})

exports.uploadProductImage = uploadReport.single('image');