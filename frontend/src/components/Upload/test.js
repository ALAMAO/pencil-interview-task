import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import classes from './Upload.module.css'
import CryptoJS from 'crypto-js';

export default function Upload() {
    const [isLoadingState, setIsLoadingState] = useState(true);


    const onDrop = useCallback(acceptedFiles => {
        setIsLoadingState(false);
        console.log("Loading state upon dropping file ", isLoadingState)

        // Load File and convert to MD5 hash
        var file = acceptedFiles[0]
        var reader = new FileReader();

        reader.onload = function (event) {


            var binary = event.target.result;
            var md5 = CryptoJS.MD5(binary).toString();

            //Send md5 hash AND file to DB
            setTimeout(() => {
                setIsLoadingState(false);
                console.log("Loading state upon file upload ", isLoadingState)

            }, 3000);

        };

        reader.readAsBinaryString(file);

    }, [isLoadingState])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div className={classes.Centre}>
            <div {...getRootProps({})} className={classes.Card}>
                <img
                    src={`https://image.flaticon.com/icons/svg/1837/1837526.svg`}
                    width={"50px"}
                    alt="uploadIcon"
                />
                {/* Creates a break for the words to be on next line */}
                <div className={classes.break}></div>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop your files here</p> :
                        <p>Click to upload an image or drop a file</p>
                }
            </div>
        </div>

    )
}
