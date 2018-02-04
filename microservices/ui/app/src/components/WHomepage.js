import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import $ from "jquery";
import WNavbar, { WCard } from "./WConstComps";
import { cardData } from "./constdata";

class WHomepage extends Component {
  constructor(props) {
    super(props);
    this.sendCred = this.sendCred.bind(this);
    this.state = {
      id: "",
      username: "",
      email: ""
    };
  }
  sendCred(e) {
    e.preventDefault();
    let username = $("#signin-username").val();
    let password = $("#signin-password").val();
    let data = JSON.stringify({
      username: username,
      password: password
    });
    fetch("https://api.flub75.hasura-app.io/login", {
      method: "POST", // or 'PUT'
      body: data,
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(res => res.json())
      .then(res => {
        let id = res.id;
        let username = res.username;
        let email = res.email;
        let passData = [id, username, email];
        this.setState({
          id,
          username,
          email
        });
        //passing data upstream to be implemented
        //this.props.userInfo(passData);
        return;
      })//fix the bug alert is being shown even if authentication was valid
      .catch(error => alert("Username/password is incorrect"));
  }

  render() {
    let { title, text } = cardData.homepage;
    return (
      <div>
        <WNavbar />
        <div className="container-fluid" id="homepage-cardform-div">
          <div className="row">
            <div className="offset-1 col-10 col-sm-6" id="homepage-card">
              <WCard title={title} text={text} />
            </div>
            <div className="offset-1 col-10 col-sm-3" id="homepage-signin-form">
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
