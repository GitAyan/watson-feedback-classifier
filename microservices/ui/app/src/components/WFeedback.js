import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input,ListGroup, ListGroupItem,Table } from "reactstrap";
import $ from 'jquery';
import WNavbar,{WCard} from "./WConstComps";
import {cardData} from './constdata';

class Catlist extends Component {
  render() {
    return (
      <div>
        {
          this.props.list.map(( el, i )=> {
            return <ListGroupItem key={i} id={`cat-list-item-${i}`}>{el}</ListGroupItem>
          })
        }
      </div>
    );
  }
}

/* class Keywords extends Component {
  render() {
    return (
      <Table dark>
        <thead>
          <tr>
            <th>#</th>
            <th>Keyword</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
          </tr>
        </tbody>
      </Table>
    );
  }
} */


class WFeedback extends Component {
 
  constructor(props) {
    super(props);
    this.getResults = this.getResults.bind(this);
    this.state = {
      list:["Categories"]
    }
  }
  getResults(e) {
    e.preventDefault();
    let data = JSON.stringify({
      username: "sathya",
      password: "sathya"
    });
    fetch("https://api.flub75.hasura-app.io/login", {
      method: "POST", // or 'PUT'
      body: data,
      headers: new Headers({
        "Content-Type": "application/json"
      })
    }).catch(err => alert("something went wrong!"));
    let username = "sathya";
    let type = "text";
    let userInput = $("#feedback-text").val();
    let userData = JSON.stringify({
      username: username,
      type: type,
      string: userInput
    });
    setTimeout(() => {
      fetch("https://api.flub75.hasura-app.io/input", {
      method: 'POST', // or 'PUT'
      body: userData, 
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res => res.json())
    .then(res => {
      let recievedCat =  res.categories.map(el => {
        return el.label
      })
      this.setState({
        list:[this.state.list[0],...recievedCat]
     })
    })
    .catch(error => alert("Something went wrong\nTry again"));
    }, 500);
  }
  render() {
    let {title,text} = cardData.feedback;
    return (
      <div>
        <WNavbar />
        <div className="container-fluid">
        <div className="row"  id="feedback-card-form">
          <div className="col-10 offset-1 my-auto col-sm-5" id="feedback-card">
          <WCard text={text} title={title} />
          </div>
          <div className="col-10 col-sm-5">
            <Form>
              {/* <Label
                for="form-title"
                className="form-label forms-title"
                >
                Get Feedback
              </Label>
             <FormGroup>
                <Label for="username" className="form-label">
                  Email
                </Label>
                <Input
                  disabled
                  placeholder="Enter your Username"
                />
              </FormGroup> */}
              <FormGroup>
                <Label for="Feedback" className="form-label">
                  Your Text
                </Label>
                <Input type="textarea" name="text" id="feedback-text" placeholder="Enter Your Text here" />
              </FormGroup>
              <div className="form-btn">
                <Button

                  outline
                  color="primary"
                  className="mx-auto"
                  onClick={this.getResults}
                  id="show-result"
                >
                  Show Result
                </Button>
              {/*   <Button
   
                  outline
                  name="show"
                  color="primary"
                  className="mx-auto"
                  onClick={this.sendFeedback}
                  id="send-feedback"
                >
                  Send Feedack
                </Button> */}
              </div>
            </Form>           
          </div>
        </div>
        <div className="row">
          <div className="col-10 offset-1">
          <ListGroup id="catagories-list">
              <Catlist list={this.state.list}></Catlist>
            </ListGroup>
          </div>
        </div>       
      </div>
      </div>
    );
  }
}

export default WFeedback;
