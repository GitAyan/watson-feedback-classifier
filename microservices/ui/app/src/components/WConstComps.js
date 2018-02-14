import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  Card,
  CardText,
  CardBody,
  CardTitle
} from "reactstrap";
//this component takes title and the text to be displayed inside of card and renders that card
export class WCard extends Component {
  render() {
    return (
      <div>
        <Card>
          <CardBody>
            <CardTitle>{this.props.title}</CardTitle>
            <CardText>{this.props.text}</CardText>
          </CardBody>
        </Card>
      </div>
    );
  }
}
//this component renders the nav bar with optional signout button
class WNavbar extends Component {
  render() {
    return (
      <div id="navbar-div">
        <Navbar
          color="faded"
          className="bg-dark navbar-dark"
          expand="md"
          id="navbar"
        >
          <NavbarBrand href="/" className="ml-md-5" id="navbar-brand">
            Feedback Classifier
          </NavbarBrand>
          {this.props.logoutbtn}
        </Navbar>
      </div>
    );
  }
}

export default WNavbar;
