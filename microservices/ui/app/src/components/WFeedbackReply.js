import React, { Component } from "react";
import WNavbar,{WCard} from "./WConstComps";
import {cardData} from './constdata';
import { NavItem, Button} from "reactstrap";

class WFeedbackReply extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.goBack = this.goBack.bind(this);
  }
  logout() {
    sessionStorage.clear();  
    this.props.AppLogout();
}
goBack() {
  this.props.goback();
}
  render() {
    const {title, text} = cardData.feedbackreply;
    const logoutbtn = (
      <NavItem className="ml-auto">
        <Button onClick={this.logout} outline  id="signoutbtn">
          Sign Out
        </Button>
      </NavItem>
    );
    return (
      <div>
        <WNavbar logoutbtn={logoutbtn}/>
        <div className="container-fluid" id="replycard">
          <div className="row">
            <div className="col-6 offset-3">
             <WCard text={text} title={title}/>
             <Button outline onClick={this.goBack} id="reply-backbtn">back</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WFeedbackReply;
