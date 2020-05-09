import React from 'react'

class Output extends React.Component {
    constructor(props) {
        super(props);
        // retrieve the image hash from url parameter
        this.imageHash = this.props.match.params.imageHash;
    }
    render() {
        return (
            <p>{this.imageHash}</p>
        )
    }
}

export default Output
