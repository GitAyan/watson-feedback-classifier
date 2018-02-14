import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import  {
  BrowserRouter,
  Switch
} from "react-router-dom";
import WHomepage from './components/WHomepage';
import WFeedback from './components/WFeedback';
import WFeedbackReply from './components/WFeedbackReply';


class App extends Component {
  
  constructor(props) {
    super(props);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
    this.loggedOut = this.loggedOut.bind(this);
    this.feedSubmit = this.feedSubmit.bind(this);
    this.goBack = this.goBack.bind(this);
    //intially user is not logged in and feedback is not submitted
    this.state = {
      isLoggedIn: false,
      feedSub: false
    }
  }
  
  componentDidMount() {
    let username = sessionStorage.getItem("username");
    //set state to show the feedback page if already user has logged in
    if(username && username !== undefined) {
      this.setState({username,  isLoggedIn:true})
    }
    if(sessionStorage.getItem("feedsub")){
      this.setState({feedSub: true})
    }
  }
//check whether the user is logged in or not
  isAuthenticated() {
    if(this.state.isLoggedIn){
      return true
    }
      return false
  }
//set email to state from hompage to use it to verify the user
  setEmail(email) {
    this.setState({
      email: email
    })
  }
//if state email and session storage email matchs set the user to logged in
  loggedIn() {
    if(this.state.email === sessionStorage.getItem("email")) {
      this.setState({
        isLoggedIn: true
      })
    }
  }
//when the logout button is clicked set state of isLoggedIn to false to redirect to homepage
  loggedOut() {
    this.setState({
      isLoggedIn:false
    })
  }
//when feedback submit button is clicked set state of feedSub to true when successfully feedback was submitted
  feedSubmit() {
    sessionStorage.setItem("feedsub",true);
    this.setState({
      feedSub: true
    })
  }
//when back button is clicked after successful submission of feedback set state of feedSub to false
  goBack() {
    sessionStorage.setItem("feedsub",false)
    this.setState({
      feedSub:false
    })
  }
  render() {
    //check whether the user is authenticated or not
    const isAuth = this.isAuthenticated();
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
          {( isAuth && this.state.feedSub ) ? (<WFeedbackReply AppLogout={this.loggedOut} goback={this.goBack}/>) : ''}
          { isAuth ?  (<WFeedback AppLogout={this.loggedOut} FeedSubmit={this.feedSubmit}/>)  :  
           (<WHomepage AppLogin={this.loggedIn} SetEmail={this.setEmail}/>) }
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
