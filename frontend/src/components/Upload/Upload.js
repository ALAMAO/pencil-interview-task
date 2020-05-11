import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import classes from './Upload.module.css'
import CryptoJS from 'crypto-js'
import axios from 'axios'
import config from './config'


export default class Upload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            isLoading: false,
            errMsg: []
        }
    }

    render() {
        let dropZone = <Dropzone
            onDropAccepted={this.onDrop}
            onDropRejected={(fileRejections) => {
                return this.onDropRejected(fileRejections)
            }}
            minSize={1048576 * config.sizeRestrictions.minSizeInMB}
            maxSize={1048576 * config.sizeRestrictions.maxSizeInMB}
            accept={'image/*'}
        >
            {({ getRootProps, getInputProps }) => (
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
                        {this.state.errMsg}
                        <div className={classes.break}></div>
                        {/* eslint-disable-next-line */}
                        <a className={classes.MockButton}>
                            <span className={classes.away}>Or click to select a file</span>
                            <span className={classes.over}>Max File Size: 5MB</span>
                        </a>
                        <span className={classes.Info}>Max image size: {config.sizeRestrictions.maxSizeInMB}MB. Supported image types: jpg, jpeg or png </span>
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
                <h1 style={{ color: "rgb(0,37,53)" }}>{config.uiMessages.spinnerMessage}</h1>
                <div className={classes.break}></div>
                <span style={{ fontSize: "5rem" }} role="img" aria-label="sheep">{config.uiMessages.spinnerEmoji}</span>
            </>
        }

        return (<div className={classes.Centre}>
            {dropZone}
        </div>
        )
    }

    onDropRejected = (fileRejections) => {
        const errorMessages = []
        const errObject = fileRejections[0].errors

        errObject.forEach(errorObj => {
            let errorCode = errorObj.code
            switch (errorCode) {
                case "file-invalid-type":
                    errorMessages.push(<React.Fragment key={errorCode}><span className={classes.Danger}>{config.errorMessages.invalidFileMessage} </span> <div className={classes.break}></div></React.Fragment>)
                    break
                case "file-too-large":
                    errorMessages.push(<React.Fragment key={errorCode}><span className={classes.Danger}>{config.errorMessages.fileSizeExceedMessage(config.sizeRestrictions.maxSizeInMB)}</span> <div className={classes.break}></div></React.Fragment>)
                    break
                default:
                    errorMessages.push(<React.Fragment key={errorCode}><span className={classes.Danger}>"Unidentified Error" </span> <div className={classes.break}></div></React.Fragment>)
            }
        })
        this.setState({ errMsg: errorMessages })
    }

    onDrop = (files) => {
        try {
            let that = this
            this.setState({ files })
            this.setState({ isLoading: true })
            // Load File and convert to MD5 hash
            let file = files[0]
            let reader = new FileReader()
            let formData = new FormData()
            let img = new Image()

            reader.onload = function (event) {
                let width, height
                img.src = reader.result
                // get image dimensions
                img.onload = function () {
                    width = img.width
                    height = img.height

                    formData.append("width", width)
                    formData.append("height", height)

                    //Send md5 hash AND file to DB
                    axios.post(`${config.endpoints.dbPostURL}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                        .then(res => {
                            console.log(res.data)
                            that.setState({ isLoading: false })
                            return that.props.history.push(`/output/${md5}`)

                        })
                        .catch(err => {
                            console.log(err)
                            that.setState({ isLoading: false, errMsg: err.message })
                        })
                }

                var binary = event.target.result
                var md5 = CryptoJS.MD5(binary).toString()

                formData.append("file", file)
                formData.append("id", md5)

            }
            reader.readAsDataURL(file)
        }
        catch (err) {
            console.log(err)
        }
    }
}
