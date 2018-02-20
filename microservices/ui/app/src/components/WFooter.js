import React, { Component } from 'react';

class WFooter extends Component {
    render() {
        return (
        <div id = "footer" > <p>Developed by
            <span id="devname">Feedback Classifier Team</span>, powered by &copy;
            <a  rel="noreferrer noopener"
                href="https://www.ibm.com/watson/services/natural-language-understanding/"
                target="_blank">Watson</a>
            &
            <a href="https://www.hasura.io" rel="noreferrer noopener" target="_blank">Hasura</a>
            </p> 
        </div>
        );
    }
}

export default WFooter;