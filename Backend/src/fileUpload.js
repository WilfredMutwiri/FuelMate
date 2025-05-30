const multer = require('multer');
const File=require('./models/auth/fileModel.js'); ;


const storage = multer.memoryStorage();

const upload = multer({ storage: storage});
const fileUpload = (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: 'File upload failed', details: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded'});
        }else{
            const newFile = new File({
                filename: req.file.originalname,
                fileUrl: {
                    data: req.file.buffer,
                    filename: req.file.originalname,
                    contentType: req.file.mimetype
                }
            });
            newFile.save()
                .then(() => {
                    res.status(200).json({ message: 'File uploaded successfully', file: req.file });
                })
                .catch((error) => {
                    res.status(500).json({ error: 'Failed to save file information', details: error.message });
                });
        }
    });
}

module.exports = fileUpload;