
const config = {
    sizeRestrictions: {
        minSizeInMB: 0,
        maxSizeInMB: 1,
    },
    errorMessages: {
        invalidFileMessage: "Please upload an image file of type jpg, jpeg or png",
        fileSizeExceedMessage: (size) => `File is too large. Max size: ${size} MB`,
    },
    uiMessages: {
        spinnerMessage: `Please Wait While We Classify Your Image`,
        spinnerEmoji: `🤗`,
    },
    endpoints: {
        dbPostURL: `https://httpbin.org/post`
    }
}



export default config;