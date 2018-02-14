import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import $ from "jquery";
import WNavbar from "./WConstComps";

class WHomepage extends Component {
  constructor(props) {
    super(props);
    this.sendCred = this.sendCred.bind(this);
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
      $.ajax({
        type: "POST",
        url: "https://api.flub75.hasura-app.io/login",
        data: data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .done(res => {
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
        .fail(error => alert("username/password is invalid"));
    }else {
      alert("please enter username and password")
    }
   
  }

  render() {
      return (
      <div>
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
      </div>
    );
  }
}

export default WHomepage;
