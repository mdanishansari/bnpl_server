const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'application/pdf': 'pdf'
};

const VIDEO_MIME_TYPE_MAP = {
    'video/mp4': 'mp4'
}

const updateDocumentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type!');
        if (isValid) { error = null; }
        const path = req.body.path;
        const destPath = 'images/' + path;
        cb(error, destPath);
    }, filename: (req, file, cb) => {
        const type = req.body.type;
        const retId = req.retailer.id;
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, retId + '_' + type + '.' + ext);
    }
})

module.exports.updateDoc = multer({ storage: updateDocumentStorage }).single('document');