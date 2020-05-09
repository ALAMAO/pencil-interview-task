import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import classes from './Upload.module.css'
import CryptoJS from 'crypto-js';
import axios from 'axios';


export default class Upload extends Component {
    constructor(props) {
        super(props);
        this.onDrop = (files) => {
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
        };
        this.state = {
            files: [],
            isLoading: false
        };
    }

    render() {
        let dropZone = <Dropzone onDrop={this.onDrop}>
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
                        <p>Drag 'n' drop some files here, or click to select files</p>

                    </div>

                </section>
            )
            }
        </Dropzone>

        if (this.state.isLoading) {
            dropZone = <div className={classes.Loader}>Loading...</div>
        }

        return (<div className={classes.Centre}>
            {dropZone}
        </div>
        );
    }
}
