const fs = require("fs");

const fileUpload = async (req, name, uploadPath, acceptedFileTypes, maxFileSize) => {
    const file = req.files[name];

    if (!acceptedFileTypes.includes(file[0].mimetype)) {
        return {
            isUploaded: false,
            message: "This file type can not be accepted"
        };
    }

    if (file.size > maxFileSize) {
        return {
            isUploaded: false,
            message: "File size exceeded"
        };
    }

    // await file[0].mv(uploadPath);

    return {
        isUploaded: true
    };
};

const removeExistFile = existFile => {
    if (fs.existsSync(existFile)) {
        fs.unlink(existFile, (err) => {
            if (err) throw err;
        });
    }
};

module.exports = {
    fileUpload,
    removeExistFile
};
