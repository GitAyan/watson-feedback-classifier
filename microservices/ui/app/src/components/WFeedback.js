import React, {Component} from "react";
import { NavItem,Button,Form,FormGroup,Label,Input,ListGroup,ListGroupItem,Table,Card, CardTitle, CardText} from "reactstrap";
import $ from 'jquery';
import WNavbar, {WCard} from "./WConstComps";
import {cardData} from "./constdata";
import spinner from "./spinner.svg"
import WFooter from "./WFooter";
//create a list of category items based on the user input and fetch response
const Catlist = (props) => {
  return (
    <div>
      {props
        .list
        .map((el, i) => {
          return <ListGroupItem key={i} id={`cat-list-item-${i}`}>{el}</ListGroupItem>
        })
      }
    </div>
  )
}
//create a table with all the keywords, emotions and their percentages.
const Keywords = (props) => {
  return (
    <Table responsive id="keywords-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Keyword</th>
          <th>Relevance</th>
          <th>Sadness</th>
          <th>Joy</th>
          <th>Anger</th>
          <th>Fear</th>
          <th>sentiment</th>
        </tr>
      </thead>
      <tbody>
        {
        props
          .keywords
          .map((el, i) => {
            return (
              <tr key={i}>
                <td scope="row">{i + 1}</td>
                <td>{el[0]}</td>
                <td>{el[1]}%</td>
                <td>{el[2]}%</td>
                <td>{el[3]}%</td>
                <td>{el[4]}%</td>
                <td>{el[5]}%</td>
                <td>{el[6]}</td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
  );
}

class WFeedback extends Component {

  constructor(props) {
    super(props);
    this.getResults = this.getResults.bind(this);
    this.fetchUpdatesState = this.fetchUpdatesState.bind(this);
    this.logout = this.logout.bind(this);
    this.sendFeedback = this.sendFeedback.bind(this);
    this.calScore = this.calScore.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.state = {
      email: sessionStorage.getItem("email"),
      list: ["Categories"],
      keywords: [],
      isLoading: false,
      visible: false,
      errorText: ""
    }
  }
  //get results for the user input to display on clicking "show result" button
  getResults(e) {
    e.preventDefault();
    let username = sessionStorage.getItem("username");
    let type = "text";
    let userInput = $("#feedback-text").val();
    let userData = JSON.stringify({username: username, type: type, string: userInput});
    this.setState({isLoading:true});
    if(this.state.list.length > 1){
      let results = document.getElementById("results");
      results.classList.remove("results-visible");
      results.classList.add("results-hidden");
    }
    if(userInput.length > 15) {
      fetch("https://api.flub75.hasura-app.io/input", {
        method: 'POST', 
        body: userData,
        headers: new Headers({'Content-Type': 'application/json'})
      })
      .then(res => res.json())
      .then(res => {
        this.fetchUpdatesState(res);
        this.setState({isLoading: false});
      })
      .catch(error =>{
        this.setState({
          isLoading:false,
          errorText:"We couldn't find results for your input.",
          visible: true,
        });
      });
    } else {
      this.setState({
        isLoading: false,
        errorText: "Enter some text or Enter some lengthy text.",
        visible: true
      })
    }
}
//update the state with received keywords to display it to the user
  fetchUpdatesState(res) {
    let recievedCat = res
      .categories
      .map(el => {
        return el.label
      });
    let resKeywords = res.keywords;
    let keywords = []
    for (let i = 0; i < resKeywords.length; i++) {
      let text = resKeywords[i].text;
      let relevance = Math.ceil(resKeywords[i].relevance * 100);
      let sadness = Math.ceil(resKeywords[i].emotion.sadness * 100);
      let joy = Math.ceil(resKeywords[i].emotion.joy * 100);
      let anger = Math.ceil(resKeywords[i].emotion.anger * 100);
      let fear = Math.ceil(resKeywords[i].emotion.fear * 100);
      let sentiment = resKeywords[i].sentiment.label;
      keywords.push([text,relevance,sadness,joy,anger,fear,sentiment]);
    }
    this.setState({
      list: [
        this.state.list[0], ...recievedCat
      ],
      keywords: keywords
    })
    let results = document.getElementById("results");
    results.classList.remove("results-hidden");
    results.classList.add("results-visible");
  }
//clear the session storage and logout the user
  logout() {
      sessionStorage.clear();  
      this.props.AppLogout();
  }
//send feedback input to /input endpoint and pass the response to calScore() to calculate score
  sendFeedback(e) {
    e.preventDefault();
    let username = sessionStorage.getItem("username");
    let email = sessionStorage.getItem("email");
    let id = sessionStorage.getItem("id");
    let type = "text";
    let userInput = $("#feedback-text").val();
    let userData = JSON.stringify({username: username, type: type, string: userInput});
    let data = [id,username,email,userInput];
    this.setState({isLoading: true});
    fetch("https://api.flub75.hasura-app.io/input", {
        method: 'POST', 
        body: userData,
        headers: new Headers({'Content-Type': 'application/json'})
      })
      .then(res => res.json())
      .then(res => {
       this.calScore(res,data);
      })
      .catch(error => {
        this.setState({
          isLoading:false,
          errorText:"Something went wrong. Try again.",
          visible: true,
        });
      });
  }
//calculate the total no. of times the labels has repeated in the response and based on that set score value
//send the data and score value to /sendemail enpoint where the rest of process will be taken care of.
  calScore(res,data) {
    let pos = 0, neg = 0, neu = 0, score = 0;
    //counting labels from keywords array of response
    for(let i = 0; i < res.keywords.length; i++) {
      let label = res.keywords[i].sentiment.label;
      if(label ===  "positive"){
        pos++
      }else if(label === "neutral") {
        neu++
      }else {
       neg++
      }
    }
    //counting labels from entities array of response
    for(let i = 0; i < res.entities.length; i++) {
      let label = res.entities[i].sentiment.label;
      if(label ===  "positive"){
        pos++
      }else if(label === "neutral") {
        neu++
      }else {
       neg++
      }
    }
    //setting score value based on certain count conditions
    if(pos > neg && pos > neu) {
      score = 20;
    }else if((neu === pos && neu > neg) || (neu === neg && neu > pos) || (neu > pos && neu >neg)) {
      score = 10
    }else if(neg > pos && neg > neu){
      score = 30
    }
    //send data to sendemail endpoint only if score is set and greater than 0.
    if( score !== 0 ) {
      let sendData = JSON.stringify({
        "username": data[1],
        "user_id": data[0],
        "emailid": data[2],         
        "feedbacktext": data[3],
        "score": score
      });
      $.ajax({
        type: 'POST', 
        url:"https://api.flub75.hasura-app.io/sendemail",
        data: sendData,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .done(res => {
        this.setState({isLoading:false})
       this.props.FeedSubmit();
      }).catch( res => {
        this.setState({
          isLoading:false,
          errorText:"Sending Feedback failed. Try again.",
          visible: true,
        });
      })
    }
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  render() {    
    {
      this.state.isLoading
        ? ($("#spinnerdiv").removeClass("div-hidden").addClass("spinnerdiv-visible").css("height",$("html").height()))
        : ($("#spinnerdiv").removeClass("spinnerdiv-visible").addClass("div-hidden"));
    }
    {
      this.state.visible
      ? ($("#erroralertdiv").removeClass("div-hidden").addClass("erroralert-visible").css("height",$("html").height()))
      : ($("#erroralertdiv").removeClass("erroralert-visible").addClass("div-hidden"));
    }
    //logout button to be passed to navbar
    const logoutbtn = (
      <NavItem className="ml-auto">
        <Button onClick={this.logout} outline  id="signoutbtn">
          Sign Out
        </Button>
      </NavItem>
    );
    let {title, text} = cardData.feedback;
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
        <WNavbar logoutbtn={logoutbtn}/>
        <div className="container-fluid">
          <div className="row" id="feedback-card-form">
            <div className="col-10 offset-1" id="feedback-card">
              <WCard text={text} title={title}/>
            </div>
            <div className="col-10 offset-1 col-sm-6 offset-sm-3 ">
              <Form>
                <Label for="form-title" className="form-label forms-title">
                  Feedback
                </Label>
                <FormGroup>
                  <Label for="username" className="form-label">
                    Email
                  </Label>
                  <Input disabled placeholder={this.state.email}/>
                </FormGroup>
                <FormGroup>
                  <Label for="Feedback" className="form-label">
                    Your Text
                  </Label>
                  <Input
                    type="textarea"
                    name="text"
                    id="feedback-text"
                    placeholder="Enter Your Text here"/>
                </FormGroup>
                <div className="form-btn">
                  <Button
                    outline
                    color="primary"
                    className="mx-auto"
                    onClick={this.getResults}
                    id="show-result">
                    Show Result
                  </Button>
                  <Button
                    outline
                    name="show"
                    color="primary"
                    className="mx-auto"
                    onClick={this.sendFeedback}
                    id="send-feedback">
                    Send Feedback
                  </Button>
                </div>
              </Form>
            </div>
          </div>
          <div className="results-hidden" id="results">
            <div className="row">
              <div className="col-10 offset-1">
                <ListGroup id="catagories-list">
                  <Catlist list={this.state.list}></Catlist>
                </ListGroup>
              </div>
              <div className="col-10 offset-1">
                <Keywords keywords={this.state.keywords}/>
              </div>
            </div>
          </div>
        </div>
        <WFooter />
      </div>
    );
  }
}

export default WFeedback;
