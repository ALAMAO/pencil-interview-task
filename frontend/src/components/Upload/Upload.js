import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import React, { useCallback, useState } from 'react'
import classes from './Upload.module.css'
import CryptoJS from 'crypto-js';
import { useHistory } from 'react-router-dom';
import axios from 'axios'


export default function Upload() {


    // called every time a file's `status` changes
    const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }

    // receives array of files that are done uploading when submit button is clicked
    const handleSubmit = (files, allFiles) => {

        var reader = new FileReader();
        files.map(fileObj => {

            // console.log("This is the file Object", fileObj)
            // Load File and convert to MD5 hash
            var file = fileObj.file

            reader.onload = function (event) {
                var binary = event.target.result;
                var md5 = CryptoJS.MD5(binary).toString();
                fileObj.meta.md5 = md5

                //Mock api to Send md5 hash AND fileObj to DB
            }
            reader.readAsBinaryString(file);

            let formData = new FormData()
            formData.append("file", file)
            formData.append("meta", JSON.stringify(fileObj.meta))

            // Change the url here
            axios.post("https://httpbin.org/post", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => console.log(res.data))
                .catch(err => console.log(err))
        })

        // Redirect to another page?

    }

    return (
        <div className={classes.Centre}>
            <Dropzone
                onChangeStatus={handleChangeStatus}
                onSubmit={handleSubmit}
                accept="image/*"
                inputContent="Click to upload an image or drop a file"
                style={{ dropzone: { overflow: "hidden" } }}
            />


        </div>
    )
}

