import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Card, CardTitle, CardText } from "reactstrap";
import $ from "jquery";
import WNavbar from "./WConstComps";
import spinner from "./spinner.svg";
import WFooter from "./WFooter";

class WHomepage extends Component {
  constructor(props) {
    super(props);
    this.sendCred = this.sendCred.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.state = {
      isLoading: false,
      visible: false,
      errorText: ""
    }
  }
//send user details to verify if user is registered or not.
  sendCred(e) {
    e.preventDefault();
    let username = $("#signin-username").val();
    let password = $("#signin-password").val();
    let data = JSON.stringify({
      username: username,
      password: password
    });
    if(username.length > 0 && password.length > 0) {
      this.setState({
        isLoading: true,
        visible: false
      });
      $.ajax({
        type: "POST",
        url: "https://api.flub75.hasura-app.io/login",
        data: data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .done(res => {
        this.setState({
          isLoading: false
        });
        let id = res.user_id;
        let username = res.user_name;
        let email = res.email_id;
        if(username !== undefined && username !== null) {
          sessionStorage.setItem("username",username);
          sessionStorage.setItem("email",email);
          sessionStorage.setItem("id",id);
        }
        //set email in the app component state
        this.props.SetEmail(email);
        //verify the email in app component state and sessionstorage to verify and login user
        this.props.AppLogin();
      })
      .fail(error =>{ 
        if(error.status === 503){
        this.setState({
          isLoading: false,
          errorText:"Looks like server is asleep. Try after 2 minutes",
          visible: true
        });
      } else {
        this.setState({
          isLoading: false,
          errorText:"Username/Password is incorrect. Try again.",
          visible: true
        });
      }
      });
    }else {
      this.setState({
        isLoading: false,
        errorText:"please enter Username and Password.",
        visible: true
      });
    }
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  render() {
    {
      this.state.isLoading
        ? ($("#spinnerdiv").removeClass("div-hidden").addClass("spinnerdiv-visible"))
        : ($("#spinnerdiv").removeClass("spinnerdiv-visible").addClass("div-hidden"));
    }
    {
      this.state.visible
      ? ($("#erroralertdiv").removeClass("div-hidden").addClass("erroralert-visible"))
      : ($("#erroralertdiv").removeClass("erroralert-visible").addClass("div-hidden"));
    }
      return (
      <div>
        <div className="div-hidden" id="spinnerdiv">
           <img src={spinner} className="spinner" alt="spinner"/>
        </div>
        <div id="erroralertdiv" className="div-hidden">
         <Card id="erroralert">
          <CardTitle id="errortitle">Error</CardTitle>
          <CardText id="errortext">
            {this.state.errorText}
          </CardText>
          <Button
                onClick={this.onDismiss}
                outline
                id="errorback-btn"
              >
                close
              </Button>
         </Card>
        </div>
        <WNavbar />
        <div className="container-fluid" id="homepage-div">
          <div className="row">
            <div className="col-10 col-sm-6 col-md-4 offset-1 offset-sm-3 offset-md-4" id="homepage-signin-form">
              <div id="signin-form-div">
                <Form>
                  <Label for="form-title" className="form-label forms-title">
                    Sign In
                  </Label>
                  <FormGroup>
                    <Label for="username" className="form-label">
                      Username
                    </Label>
                    <Input
                      type="text"
                      name="username"
                      placeholder="Enter your Username"
                      id="signin-username"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password" className="form-label">
                      Password
                    </Label>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter your Password"
                      id="signin-password"
                    />
                  </FormGroup>
                  <div className="form-btn">
                    <Button
                      type="submit"
                      onClick={this.sendCred}
                      outline
                      color="primary"
                      id="signin-form-btn"
                    >
                      Sign In
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>          
        </div>
        <WFooter />
      </div>
    );
  }
}

export default WHomepage;
