import React from 'react'
import { ReactPictureAnnotation } from 'react-picture-annotation'
import axios from './Api'
import Loader from 'react-loader-spinner'
import './Output.css'

class Output extends React.Component {
    constructor(props) {
        super(props);
        this.setState = this.setState.bind(this);
        // retrieve the image hash from url parameter
        this.state = {
            annotations: [
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
            ],
            width: window.outerWidth,
            height: window.outerHeight,
            loading: true,
            error: false,
            imageUrl: ''
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        axios.get('image/get') //+ this.props.match.params.imageHash,)
            .then((response) => {
                const data = response.data[0]
                const newRatio = this.getRatio(data.width, window.innerWidth, data.height, window.innerHeight)
                const boxes = this.unpackMarks(data.boxes, newRatio, data.width, data.height)
                this.setState({
                    ratio: newRatio,
                    loading: false,
                    imageUrl: 'http://localhost:8000/media/' + data.file,
                    width: data.width,
                    height: data.height,
                    annotations: boxes
                })
                console.log(response)
            })
            .catch((err) => {
                this.setState({ loading: false, error: true })
                alert(err)
                console.log(err)
            })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    render() {
        if (this.state.loading) {
            return (
                <div style={{ display: "inline-block", width: "100%", textAlign: "center" }} >
                    <Loader
                        type="Puff"
                        color="#00BFFF"
                        height={100}
                        width={100}
                    />
                </div>
            )
        } else if (this.state.error) {
            return (
                <div className="output-wrapper">
                    <p> Error in fetching resources. Please reload the page and try again. </p>
                </div>
            )
        } else {
            return (
                <div className="output-wrapper">
                    <p>{this.state.imageHash}</p>
                    <h4>Annotations</h4>
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

    onResize = () => {
        console.log("resize called")
        this.setState({ width: window.outerWidth, height: window.outerHeight });
    };

    onSelect(id) {
        console.log(id)
    }

    onChange = (annotations) => {
        this.setState({
            annotations: annotations
        })
    }

    onSubmit = () => {
        console.log(this.state.annotations)
        // TODO: axios.put() 
    }
    
    getRatio = (incomingWidth, windowWidth, incomingHeight, windowHeight) => {
        if (incomingWidth < windowWidth * 0.8 && incomingHeight < windowWidth * 0.8) {
            return 1
        } else {
            return Math.min((windowWidth * 0.8) / incomingWidth, (windowHeight * 0.8) / incomingHeight)
        }
    }

    unpackMarks = (rawJsonArray, ratio, originalWidth, originalHeight) => {
        let newArray = []
        rawJsonArray.forEach(element => {
            newArray.push({
                id: element.id,
                comment: element.label,
                mark: {
                    type: "RECT",
                    x: element.x * originalWidth * ratio,
                    y: element.y * originalHeight * ratio,
                    width: element.width * originalWidth * ratio,
                    height: element.height * originalHeight * ratio
                }
            })
        });
        return newArray;
    }

    // TODO
    repackMarks = () => {

    }
}

export default Output
