import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import classes from './Upload.module.css'
import CryptoJS from 'crypto-js';
import axios from 'axios';


export default class Upload extends Component {
    constructor(props) {
        super(props);

        // this.onDropRejected = (files) => {
        //     console.log(files)
        // }

        this.onDrop = (files) => {
            try {
                var that = this;
                this.setState({ files })
                this.setState({ isLoading: true });


                // Load File and convert to MD5 hash
                var file = files[0]
                var reader = new FileReader();
                let formData = new FormData()
                var img = new Image();

                reader.onload = function (event) {

                    let width, height;
                    img.src = reader.result

                    // get image dimensions
                    img.onload = function () {
                        width = img.width
                        height = img.height

                        formData.append("width", width)
                        formData.append("height", height)

                        //Send md5 hash AND file to DB
                        // *To-do: Change the url here
                        axios.post("https://httpbin.org/post", formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                            .then(res => {
                                console.log(res.data)
                                that.setState({ isLoading: false });
                                return that.props.history.push(`/output/${md5}`);

                            })
                            .catch(err => console.log(err))
                    }

                    var binary = event.target.result;
                    var md5 = CryptoJS.MD5(binary).toString();

                    formData.append("file", file)
                    formData.append("md5", md5)

                };
                reader.readAsDataURL(file);
            }
            catch (err) {
                console.log(err)
            }
        };
        this.state = {
            files: [],
            isLoading: false
        };
    }


    render() {
        const minSizeInMB = 0;
        const maxSizeInMB = 1;

        let dropRej;

        let dropZone = <Dropzone
            onDropAccepted={this.onDrop}
            onDropRejected={(fileRejections) => {
                console.log(fileRejections)

                const errorMessages = []

                const errObject = fileRejections[0].errors
                errObject.forEach(errorObj => {
                    let errorCode = errorObj.code

                    switch (errorCode) {
                        case "file-invalid-type":
                            errorMessages.push(<><span className={classes.Danger}>Please upload an image file of type jpg, jpeg or png </span> <div className={classes.break}></div></>)
                            break;
                        case "file-too-large":
                            errorMessages.push(<><span className={classes.Danger}>File is too large. Max size: {maxSizeInMB} MB </span> <div className={classes.break}></div></>)
                            break;
                        default:
                            errorMessages.push(<><span className={classes.Danger}>"Unidentified Error" </span> <div className={classes.break}></div></>)
                    }
                })



                dropRej = errorMessages
            }}
            minSize={1048576 * minSizeInMB}
            maxSize={1048576 * maxSizeInMB}
            accept={'image/*'}
        >
            {({ getRootProps, getInputProps, fileRejections }) => (
                <section >
                    <div {...getRootProps({ className: 'dropzone' })} className={classes.Card}>

                        <img
                            src={`https://image.flaticon.com/icons/svg/1837/1837526.svg`}
                            width={"50px"}
                            alt="uploadIcon"
                        />
                        {/* Creates a break for the words to be on next line */}
                        <div className={classes.break}></div>
                        <input {...getInputProps()} />
                        <p>Drag and drop a file here</p>
                        <div className={classes.break}></div>
                        {dropRej}
                        <div className={classes.break}></div>
                        {/* eslint-disable-next-line */}
                        <a className={classes.MockButton}>
                            <span className={classes.away}>Or click to select a file</span>
                            <span className={classes.over}>Max File Size: 5MB</span>
                        </a>

                    </div>

                </section>
            )
            }
        </Dropzone>

        if (this.state.isLoading) {
            dropZone = <>
                <div className={classes.Loader}>
                    Loader
                </div>
                <div className={classes.break}></div>
                <h1 style={{ color: "rgb(0,37,53)" }}> Please Wait While We Classify Your Image</h1>
                <div className={classes.break}></div>
                <span style={{ fontSize: "5rem" }} role="img" aria-label="sheep">🤗</span>
            </>
        }

        return (<div className={classes.Centre}>
            {dropZone}
        </div>
        );
    }
}
