import React from 'react'
import { ReactPictureAnnotation } from 'react-picture-annotation'
import axios, { BASE_URL } from '../../Api'
import './Output.css'

const WINDOW_RESIZE_MULTIPLIER = 0.7

class Output extends React.Component {
    constructor(props) {
        super(props);
        this.setState = this.setState.bind(this);
        // retrieve the image hash from url parameter
        this.state = {
            // Annotations example
            /* annotations: [
                {
                    id: "123",
                    comment: "cat",
                    mark: {
                        type: "RECT",
                        x: 20,
                        y: 20,
                        width: 200,
                        height: 300
                    }
                }
            ], */
            annotations: [],
            originalWidth: 0,
            originalHeight: 0,
            width: window.outerWidth * WINDOW_RESIZE_MULTIPLIER,
            height: window.outerHeight * WINDOW_RESIZE_MULTIPLIER,
            manualLabel: false,
            ratio: 1,
            imageUrl: '',
            imageHash: this.props.match.params.imageHash,
            modified: false,
            loading: true,
            error: false
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        // Retrieve image URL given the corresponding image hash
        this.fetchImageBoxes();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    render() {
        let manualLabelText = ""
        if (this.state.manualLabel) manualLabelText = <h4>This image has been manually labelled before.</h4>
        if (this.state.loading) {
            return (
                <div className="output-wrapper" style={{ marginTop: "20vh" }} >
                    <div className="Loader"></div>
                </div>
            )
        } else if (this.state.error) {
            return (
                <div className="output-wrapper">
                    <p> Error in fetching resources. Please reload the page and try again. </p>
                    <button onClick={this.fetchImageBoxes}>Retry?</button>
                </div>
            )
        } else {
            return (
                <div className="output-wrapper">
                    {manualLabelText}
                    <button onClick={this.onSubmit}>Submit changes</button>
                    <div style={{ marginRight: "auto", marginLeft: (window.innerWidth - this.state.width) / 2, marginTop: "1vw", textAlign: "center" }}>
                        <ReactPictureAnnotation
                            id="picture-annotation"
                            image={this.state.imageUrl}
                            annotationData={this.state.annotations}
                            type={this.state.type}
                            value={this.state.annotation}
                            height={this.state.height}
                            width={this.state.width}
                            onSelect={this.onSelect}
                            onChange={this.onChange}
                            onSubmit={this.onSubmit}
                        />
                    </div>
                </div>
            )
        }
    }

    // Event listeners and helper functions
    onResize = () => {
        const newRatio = this.getRatio(this.state.originalWidth, this.state.originalHeight)
        this.setState({ ratio: newRatio, width: this.state.originalWidth * newRatio, height: this.state.originalHeight * newRatio });
    };

    onSelect(id) {
        // console.log(id)
    }

    onChange = (annotations) => {
        this.setState({
            annotations: annotations
        })
    }

    onSubmit = () => {
        const boxes = this.repackMarks(this.state.ratio, this.state.originalWidth, this.state.originalHeight);
        // PUT request to box update API
        axios.put(`box/update?image_id=${this.state.imageHash}`, boxes)
            .then(() => alert("Successfully updated box annotations in database!"))
            .catch(err => alert(err))
    }

    getRatio = (incomingWidth, incomingHeight) => {
        const resizedWindowWidth = window.innerWidth * WINDOW_RESIZE_MULTIPLIER
        const resizedWindowHeight = window.innerHeight * WINDOW_RESIZE_MULTIPLIER
        if (incomingWidth < resizedWindowHeight && incomingHeight < resizedWindowWidth) {
            return 1
        } else {
            return Math.min(resizedWindowWidth / incomingWidth, resizedWindowHeight / incomingHeight)
        }
    }

    unpackMarks = (rawJsonArray, ratio, originalWidth, originalHeight) => {
        let newArray = []
        rawJsonArray.forEach(element => {
            element.probability = element.probability ?? 1.00
            newArray.push({
                id: element.id,
                comment: `${element.label} - ${element.probability.toFixed(2)}`,
                originalLabel: element.label,
                mark: {
                    type: "RECT",
                    x: element.x * originalWidth, //* ratio,
                    y: element.y * originalHeight, //* ratio,
                    width: element.width * originalWidth,// ratio,
                    height: element.height * originalHeight// ratio
                }
            })
        });
        return newArray;
    }

    repackMarks = (ratio, originalWidth, originalHeight) => {
        let newArray = []
        this.state.annotations.forEach(element => {
            // check if label contains probability. if label contains probability from server, strip it via regex group matching
            const matchedLabel = element.comment.match(/(.+) - [0-1].[0-9]{2}/)
            const label = matchedLabel == null ? element.comment : matchedLabel[1]
            newArray.push({
                id: element.id,
                label: label,
                x: element.mark.x / originalWidth, // / ratio,
                y: element.mark.y / originalHeight, // / ratio,
                width: element.mark.width / originalWidth, // / ratio,
                height: element.mark.height / originalHeight, // / ratio,
                probability: 1
            })
        })
        return newArray;
    }

    fetchImageBoxes = () => {
        this.setState({ loading: true, error: false })
        axios.get(`image/get?id=${this.state.imageHash}`)
            .then((response) => {
                console.log(response)
                const data = response.data[0]
                const newRatio = this.getRatio(data.width, data.height)
                const boxes = this.unpackMarks(data.boxes, newRatio, data.width, data.height)
                this.setState({
                    ratio: newRatio,
                    loading: false,
                    imageUrl: `${BASE_URL}/media/` + data.file,
                    width: data.width * newRatio,
                    height: data.height * newRatio,
                    originalWidth: data.width,
                    originalHeight: data.height,
                    annotations: boxes,
                    manualLabel: data.manual_labelled
                })
            })
            .catch((err) => {
                this.setState({ loading: false, error: true })
                console.log(err)
            })
    }
}

export default Output
