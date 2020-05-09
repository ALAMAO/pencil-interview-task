import React from 'react'
import { ReactPictureAnnotation } from "react-picture-annotation"
import axios from 'axios'

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
            loading: false
        }
        // placeholder
        // this.state.imageUrl = "https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png"
        this.state.imageUrl = "https://sm.pcmag.com/pcmag_ap/news/g/google-rai/google-raisr-intelligently-makes-low-res-images-high-quality_us6p.jpg"
        // replace with api url once backend is done
        // this.state.imageUrl = "<url>/" + this.props.match.params.imageHash
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    render() {
        return (
            <div style={{ display: "inline-block", width: "100%", textAlign: "center" }}>
                <p>{this.state.imageHash}</p>
                <h4>Annotations</h4>
                <button onClick={this.onSubmit}>Submit changes</button>
                <div style={{ marginLeft: "15vw", marginTop: "1vw", textAlign: "center" }}>
                    <ReactPictureAnnotation
                        id="picture-annotation"
                        image={this.state.imageUrl}
                        annotationData={this.state.annotations}
                        type={this.state.type}
                        value={this.state.annotation}
                        height={this.state.height * 0.7}
                        width={this.state.width * 0.7}
                        onSelect={this.onSelect}
                        onChange={this.onChange}
                        onSubmit={this.onSubmit}
                    />
                </div>
            </div>
        )
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
        // axios.put()
    }
}

export default Output
