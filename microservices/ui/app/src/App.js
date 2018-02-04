import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
//import WHomepage from './components/WHomepage';
import WFeedback from './components/WFeedback';
//import WFeedbackReply from './components/WFeedbackReply';

class App extends Component {

  render() {
    return (
      <div className="App">
        <WFeedback />
      </div>
    );
  }
}

export default App;
