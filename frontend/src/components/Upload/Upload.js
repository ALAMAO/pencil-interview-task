import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import React, { useCallback, useState } from 'react'
import classes from './Upload.module.css'
import CryptoJS from 'crypto-js';
import { useHistory } from 'react-router-dom';


export default function Upload() {
    let loadingStatus = true;


    // specify upload params and url for your files
    const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }

    // called every time a file's `status` changes
    const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }

    // receives array of files that are done uploading when submit button is clicked
    const handleSubmit = (files, allFiles) => {
        // console.log(files.map(f => f.meta))

        files.map(fileObj => {

            // console.log("This is the file Object", fileObj)
            // Load File and convert to MD5 hash
            var file = fileObj.file
            var reader = new FileReader();

            reader.onload = function (event) {
                var binary = event.target.result;
                var md5 = CryptoJS.MD5(binary).toString();
                console.log(md5)

                //Mock api to Send md5 hash AND file to DB
                setTimeout(() => {

                }, 2000);
            }

            reader.readAsBinaryString(file);
        })
        // allFiles.forEach(f => f.remove())
        // Redirect to another page?

    }

    return (
        <div className={classes.Centre}>
            <Dropzone
                getUploadParams={getUploadParams}
                onChangeStatus={handleChangeStatus}
                onSubmit={handleSubmit}
                accept="image/*"
                inputContent="Click to upload an image or drop a file"
            />
            <div className={classes.break}></div>


        </div>
    )
}

