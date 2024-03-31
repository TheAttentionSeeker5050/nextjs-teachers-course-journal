// validate file name to be a string and no longer than 100 characters
export const validateFileName = (fileName) => {
    if (typeof fileName !== 'string') {
        return 'File name must be a string';
    }
    if (fileName.length > 100) {
        return 'File name must be less than 100 characters';
    }
    return null;
};

// validate file size to be a number and no larger than 10MB
export const validateFileSize = (fileSize) => {
    if (typeof fileSize !== 'number') {
        return 'File size must be a number';
    }
    if (fileSize > 10000000) {
        return 'File size must be less than 10MB';
    }
    return null;
};

// allowed file extensions
const allowedExtensions = ['docx', 'pdf', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'md', 'doc', 'xls', 'xlsx', 'csv', 'zip', 'rar', '7z', 'sql'];
// validate file extension to be a string and match the allowed extensions
export const validateFileExtension = (fileExtension) => {
    if (typeof fileExtension !== 'string') {
        return 'File extension must be a string';
    }
    if (!allowedExtensions.includes(fileExtension)) {
        return 'File extension is not allowed';
    }
    return null;
};

